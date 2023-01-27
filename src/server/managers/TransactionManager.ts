import { FilterQuery } from "mongoose";

import { CreateTransactionRequest } from "@endpoint/transactions/create";
import { UpdateTransactionRequest } from "@endpoint/transactions/update";
import { CookieUser } from "@server/core";
import { TransactionModel, ITransactionModel, TransactionDocument } from "@server/models";
import { BalanceManager, CurrencyRateManager } from "@server/managers";
import { SearchRequest, SearchResponse } from "@endpoint/transactions/search";
import { escapeRegExp } from "@server/utils/Global";
import constants from "@server/utils/Constants";

export class TransactionManager {
  public async CreateTransaction(request: CreateTransactionRequest, user: CookieUser): Promise<ITransactionModel> {
    const date = new Date(request.date);

    if (constants.negativeCategories.includes(request.category) && request.amount > 0) {
      request.amount = -request.amount;
    }

    const commonValue = await CurrencyRateManager.getInstance().convert(request.amount, request.currency, "USD", date);

    const balanceManager = new BalanceManager();
    await balanceManager.CommitMoney(user, {
      amount: request.amount,
      currency: request.currency,
    });

    const model: ITransactionModel = {
      amount: request.amount,
      category: request.category,
      currency: request.currency,
      date,
      description: request.description,
      source: request.source,
      userUID: user.userUID,
      isActive: true,
      isDeleted: false,
      isImported: false,
      usdValueWhenExecuted: commonValue,
      importId: null,
    };

    const document = await TransactionModel.create(model);

    return document.toJSON<ITransactionModel>() as ITransactionModel;
  }

  public async UpdateTransaction(request: UpdateTransactionRequest, user: CookieUser): Promise<ITransactionModel> {
    const date = new Date(request.date);
    const commonValue = await CurrencyRateManager.getInstance().convert(request.amount, request.currency, "USD", date);

    const document = await TransactionModel.findById(request.id);

    if (document && document.userUID === user.userUID) {
      document.amount =
        constants.negativeCategories.includes(request.category) && request.amount > 0
          ? -request.amount
          : request.amount;
      document.category = request.category;
      document.currency = request.currency;
      document.date = date;
      document.description = request.description;
      document.source = request.source;
      document.usdValueWhenExecuted = commonValue;

      await document.save();
      return document.toJSON<ITransactionModel>() as ITransactionModel;
    }

    return null;
  }

  public async BulkDeleteTransactions(ids: string[], user: CookieUser): Promise<string[]> {
    const deletedIds: string[] = [];

    for (const id of ids) {
      const result = await TransactionModel.deleteOne({
        _id: id,
      });

      if (result.deletedCount > 0) {
        deletedIds.push(id);
      }
    }

    return deletedIds;
  }

  public async SetActive(id: string, active: boolean, user: CookieUser): Promise<boolean> {
    const result = await TransactionModel.updateOne(
      {
        _id: id,
        userUID: user.userUID,
      },
      {
        $set: {
          isActive: active,
        },
      }
    );

    return result.modifiedCount > 0;
  }

  public async Search(request: SearchRequest, user: CookieUser): Promise<SearchResponse> {
    const query: FilterQuery<TransactionDocument> = {
      userUID: user.userUID,
      isDeleted: false,
    };

    if (request.category) {
      query.category = request.category;
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

    if (request.statusFilter) {
      if (request.statusFilter === "active") {
        query.isActive = true;
      } else if (request.statusFilter === "inactive") {
        query.isActive = false;
      }
    }

    if (request.amountFilter) {
      switch (request.amountFilter) {
        case "incomeOnly":
          query.amount = { $gt: 0 };
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

    const count = await TransactionModel.countDocuments(query);

    return {
      total: count,
      items: transactions || [],
    };
  }

  public async ImportSearch(user: CookieUser, importName: string, firstN: number): Promise<ITransactionModel[]> {
    const results = await TransactionModel.find(
      {
        userUID: user.userUID,
        isDeleted: false,
        isImported: true,
        source: importName,
      },
      {
        date: 1,
        description: 1,
        amount: 1,
      }
    )
      .sort({
        date: -1,
      })
      .limit(firstN);

    return results || [];
  }

  public async BulkInsert(transactions: ITransactionModel[]): Promise<boolean> {
    const result = await TransactionModel.insertMany(transactions);

    return result.length > 0;
  }

  public async UndoImport(importId: string, user: CookieUser): Promise<number> {
    const result = await TransactionModel.deleteMany({
      userUID: user.userUID,
      isImported: true,
      importId,
    });

    return result.deletedCount;
  }
}
