import { FilterQuery, ObjectId } from "mongoose";

import { CreateTransactionRequest } from "@endpoint/transactions/create";
import { UpdateTransactionRequest } from "@endpoint/transactions/update";
import { CookieUser } from "@server/core";
import { TransactionModel, ITransactionModel, TransactionDocument } from "@server/models";
import { BalanceManager, CurrencyRateManager } from "@server/managers";
import { SearchRequest, SearchResponse } from "@endpoint/transactions/search";
import { escapeRegExp, round } from "@server/utils/Global";
import constants from "@server/utils/Constants";
import { Currency, Money, TransactionBank } from "@utils/Types";
import { isNegative } from "@utils/Category";

interface DeleteManyTransaction extends Money {
  id: string;
  isActive: boolean;
  description: string;
}

export class TransactionManager {
  private readonly balanceManager: BalanceManager;

  constructor(private user: CookieUser) {
    this.balanceManager = new BalanceManager(this.user);
  }

  public async CreateTransaction(request: CreateTransactionRequest): Promise<ITransactionModel> {
    const date = new Date(request.date);

    if (isNegative(request.category) && request.amount > 0) {
      request.amount = -request.amount;
    }

    request.amount = round(request.amount); // Note: Guard against precision problem like -64.16999999999996

    const [commonValue] = await Promise.all([
      CurrencyRateManager.getInstance().convert(request.amount, request.currency, "USD", date),
      request.alterBalance
        ? this.balanceManager.CommitMoney({
            amount: request.amount,
            currency: request.currency,
          })
        : Promise.resolve(true),
    ]);

    const document = await TransactionModel.create({
      amount: request.amount,
      category: request.category,
      currency: request.currency,
      date,
      dateUpdated: new Date(),
      description: request.description,
      source: request.source,
      userUID: this.user.userUID,
      isActive: true,
      isImported: false,
      isInvestment: request.isInvestment === undefined ? false : request.isInvestment,
      investmentEventType: request.investmentEventType,
      usdValueWhenExecuted: commonValue,
      importId: null,
    });

    return document.toJSON<ITransactionModel>() as ITransactionModel;
  }

  public async UpdateTransaction(request: UpdateTransactionRequest): Promise<ITransactionModel> {
    request.amount = round(request.amount); // Note: Guard against precision problem like -64.16999999999996

    const date = new Date(request.date);
    const document = await TransactionModel.findById(request.id);

    if (!document || document.userUID !== this.user.userUID) {
      return null;
    }

    if (isNegative(document.category) && request.amount > 0) {
      request.amount = -request.amount;
    }

    const commitList = request.alterBalance ? [{
      amount: -document.amount,
      currency: document.currency,
    }] : []; // Uncommit old value

    const positiveAmount = Math.abs(request.amount);

    document.amount = isNegative(request.category) ? -positiveAmount : positiveAmount;
    document.category = request.category;
    document.currency = request.currency;
    document.date = date;
    document.dateUpdated = new Date();
    document.description = request.description;
    document.source = request.source;
    document.usdValueWhenExecuted = await CurrencyRateManager.getInstance().convert(
      document.amount,
      document.currency,
      "USD",
      date
    );

    if (request.alterBalance) {
      commitList.push({
        amount: document.amount,
        currency: document.currency,
      });
    }

    await Promise.all([
      document.save(),
      this.balanceManager.CommitMixedMoneyList(commitList),
    ]);

    return document.toJSON<ITransactionModel>() as ITransactionModel;
  }

  public async DeleteManyAndUncommit(filter: FilterQuery<ITransactionModel>, alterBalance = true): Promise<string[]> {
    const moneyList: DeleteManyTransaction[] = await TransactionModel.find(filter, {
      amount: 1,
      currency: 1,
      description: 1,
      isActive: 1,
    });

    const totalCurrencyReversed = moneyList.reduce((acc, cur) => {
      if (!acc[cur.currency]) {
        acc[cur.currency] = 0;
      }

      if (cur.isActive && !constants.calibartionTerms.includes(cur.description.toLowerCase())) {
        acc[cur.currency] -= cur.amount;
      }

      return acc;
    }, {});

    const totalCurrency = Object.keys(totalCurrencyReversed).map<Money>((currency) => ({
      amount: round(totalCurrencyReversed[currency]),
      currency: currency as Currency,
    }));

    const deleted = await TransactionModel.deleteMany(filter);

    if (deleted.deletedCount !== 0 && alterBalance) {
      for (const money of totalCurrency) {
        if (money.amount === 0) continue;

        await this.balanceManager.CommitMoney(money);
      }
    }

    return moneyList.map((money) => money.id);
  }

  public BulkDeleteTransactions(ids: (string | ObjectId)[], alterBalance = true): Promise<string[]> {
    return this.DeleteManyAndUncommit(
      {
        userUID: this.user.userUID,
        _id: {
          $in: ids,
        },
      },
      alterBalance
    );
  }

  public async SetActive(id: string, active: boolean): Promise<boolean> {
    const item = await TransactionModel.findById(id);

    if (!item || item.userUID !== this.user.userUID) return false;
    if (item.isActive === active) return true;

    item.isActive = active;
    item.dateUpdated = new Date();

    const [saveResult] = await Promise.all([
      item.save(),
      this.balanceManager.CommitMoney({
        amount: active ? item.amount : -item.amount,
        currency: item.currency,
      }),
    ]);

    return !!saveResult;
  }

  public async Search(request: SearchRequest): Promise<SearchResponse> {
    const query: FilterQuery<TransactionDocument> = {
      userUID: this.user.userUID,
    };

    if (request.category) {
      if (request.category === "notInvestments") {
        query.isInvestment = false;
      } else {
        query.category = request.category;
      }
    }

    if (request.currency) {
      query.currency = request.currency;
    }

    if (request.searchTerm) {
      query.description = new RegExp(escapeRegExp(request.searchTerm), "i");
    }

    if (request.importId) {
      query.isImported = true;
      query.importId = request.importId;
    }

    if (!request.includeInactive) {
      query.isActive = true;
    }

    if (request.amountFilter) {
      switch (request.amountFilter) {
        case "incomeOnly":
          query.amount = { $gt: 0 };
          break;
        case "spendingOnly":
          query.amount = { $lt: 0 };
          break;
        case "moreThan25Spent":
          query.amount = { $lt: -25 };
          break;
        case "moreThan50Spent":
          query.amount = { $lt: -50 };
          break;
        case "moreThan100Spent":
          query.amount = { $lt: -100 };
          break;
        case "moreThan250Spent":
          query.amount = { $lt: -250 };
          break;
        default:
          break;
      }
    }

    if (request.dateRange && request.dateRange.from instanceof Date && request.dateRange.to instanceof Date) {
      query.date = {
        $gte: request.dateRange.from,
        $lte: request.dateRange.to,
      };
    }

    const transactions = await TransactionModel.find(query, undefined, {
      sort: {
        date: -1,
      },
      skip: request.skip,
      limit: request.take,
    });

    return {
      total: await TransactionModel.countDocuments(query),
      items: transactions || [],
    };
  }

  public async BulkInsert(transactions: ITransactionModel[], alterBalance: boolean): Promise<boolean> {
    if (!Array.isArray(transactions) || transactions.length === 0) return false;

    const [insertResult, commitSuccess] = await Promise.all([
      TransactionModel.insertMany(transactions),
      alterBalance ? this.balanceManager.CommitMixedMoneyList(transactions) : Promise.resolve(true),
    ]);

    return insertResult.length > 0 && commitSuccess;
  }

  public async ConvertInvestmentTransactionToTrend(ids: (string | ObjectId)[]) {
    if (!ids || ids.length === 0) return;

    const transactions = await TransactionModel.find({
      userUID: this.user.userUID,
      isInvestment: true,
      _id: {
        $in: ids,
      },
    });

    for (const transaction of transactions) {
      transaction.category = transaction.amount > 0 ? "trendUp" : "trendDown";
      transaction.isInvestment = false;

      await Promise.all([
        this.balanceManager.CommitMoney({
          amount: transaction.amount,
          currency: transaction.currency,
        }),
        transaction.save(),
      ]);
    }
  }

  public async SearchImportHashes(hashesToSearch: number[], source: TransactionBank, minDate: Date, maxDate: Date): Promise<number[]> {
    let results = await TransactionModel.aggregate([
      {
        $match: {
          userUID: this.user.userUID,
          source,
          date: {
            $gte: minDate,
            $lte: maxDate
          },
          $and: [
            { importHash: { $exists: true } },
            { importHash: { $ne: 0 } }
          ]
        }
      },
      {
        $match: {
          importHash: { $in: hashesToSearch.splice(0, 500) }
        }
      },
      {
        $project: {
          importHash: 1
        }
      }
    ]);

    return results?.length ? results.map<number>(o => o.importHash) : [];
  }
}
