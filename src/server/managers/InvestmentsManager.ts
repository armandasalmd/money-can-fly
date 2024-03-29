import { CookieUser } from "@server/core";
import { Category, CreateInvestmentEvent, Currency, Investment, InvestmentEventType, InvestmentSummary, Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { InvestmentModel, InvestmentDocument, IInvestmentEventModel } from "@server/models";
import { TransactionManager, CurrencyRateManager } from "@server/managers";
import { CreateInvestmentRequest } from "@endpoint/investments/create";
import { InvestmentEventDocument } from "@server/models/mongo/investment/InvestmentModel";
import { capitalise } from "@utils/Global";

export class InvestmentsManager {

  public async GetInvestment(user: CookieUser, id: string): Promise<Investment> {
    let investment: InvestmentDocument = await InvestmentModel.findOne({
      _id: id,
      userUID: user.userUID
    });

    return investment ? this.ToInvestment(investment) : null;
  }

  public async GetBasicInvestments(user: CookieUser): Promise<Investment[]> {
    const investments: InvestmentDocument[] = await InvestmentModel
    .find({ userUID: user.userUID }, {
      userUID: 0,
        "timelineEvents.title": 0,
        "timelineEvents.transaction": 0
      });
    const result: Investment[] = [];

    for (const investment of investments) {
      result.push(await this.ToInvestment(investment));
    }

    return result;
  }

  private async ToInvestment(investment: InvestmentDocument): Promise<Investment> {
    const currency = this.GetInvestmentCurrency(investment);
    const currencyRateManager = CurrencyRateManager.getInstance();
    const totalValue: Money = {
      amount: 0,
      currency,
    };

    const jsonCopy: Investment = investment.toJSON();

    for (const event of jsonCopy.timelineEvents) {
      totalValue.amount += await currencyRateManager.convert(
        event.valueChange.amount,
        event.valueChange.currency,
        currency
      );

      event.total = {
        ...totalValue,
      };
    }

    return {
      currentValue: totalValue,
      dateCreated: investment.dateCreated,
      dateModified: investment.dateModified,
      timelineEvents: jsonCopy.timelineEvents,
      title: investment.title,
      id: investment._id,
    };
  }

  private async SubmitCashTransaction(
    money: Money,
    user: CookieUser,
    description: string,
    investmentEventType: InvestmentEventType,
    category: Category = "investments",
    date: Date = new Date(),
    alterBalance: boolean = true
  ): Promise<string | undefined> {
    if (money.amount === 0) return;

    return (await new TransactionManager(user).CreateTransaction({
      amount: money.amount,
      currency: money.currency,
      category,
      date: date.toISOString(),
      description,
      source: "cash",
      isInvestment: true,
      investmentEventType,
      alterBalance
    }))._id;
  }

  public async CreateInvestment(user: CookieUser, request: CreateInvestmentRequest): Promise<Investment> {
    let transactionId: string;
    
    if (request.subtractFromBalance) {
      transactionId = await this.SubmitCashTransaction(
        {
          amount: -request.initialDeposit.amount,
          currency: request.initialDeposit.currency,
        },
        user,
        `Investment ${request.title}`,
        "created",
        "investments",
        request.startDate
      );
    }
    
    const newInvestment = new InvestmentModel({
      title: request.title,
      dateModified: new Date(),
      dateCreated: new Date(),
      timelineEvents: [
        {
          eventDate: request.startDate,
          type: "created",
          valueChange: request.initialDeposit,
          title: "Investment created",
          transaction: transactionId
        },
      ],
      userUID: user.userUID,
    });

    const savedInvestment = await newInvestment.save();
    const result: Investment = savedInvestment.toJSON();

    result.currentValue = request.initialDeposit;

    return result;
  }

  public async DeleteInvestment(user: CookieUser, investmentId: string): Promise<boolean> {
    const investment = await InvestmentModel.findById(investmentId);

    if (investment == null || investment.userUID !== user.userUID) {
      return false;
    }

    const transactionsToDelete = investment.timelineEvents.filter(o => o?.type !== "adjustment").map(o => o.transaction);
    const adjustmentTransactions = investment.timelineEvents.filter(o => o?.type === "adjustment").map(o => o.transaction);    
    const transactionManager = new TransactionManager(user);

    await Promise.all([
      transactionManager.BulkDeleteTransactions(transactionsToDelete),
      transactionManager.ConvertInvestmentTransactionToTrend(adjustmentTransactions),
      investment.delete()
    ]);

    return true;
  }

  public async DeleteEvent(user: CookieUser, eventId: string): Promise<boolean> {
    const investment: InvestmentDocument = await InvestmentModel.findOne(
      {
        userUID: user.userUID,
        "timelineEvents._id": eventId,
      },
      {
        timelineEvents: 1,
      }
    );

    if (investment == null) {
      return false;
    }

    const toBeDeleted = investment.timelineEvents.find((x: InvestmentEventDocument) => x.id === eventId);

    if (toBeDeleted) {
      // Deletes entire investment if created event is deleted
      if (toBeDeleted.type === "created") {
        return await this.DeleteInvestment(user, investment.id);
      }

      investment.timelineEvents = investment.timelineEvents.filter((x: InvestmentEventDocument) => x.id !== eventId);
      investment.dateModified = new Date();

      const transactionManager = new TransactionManager(user);

      await Promise.all([
        transactionManager.BulkDeleteTransactions([toBeDeleted.transaction], toBeDeleted.type !== "adjustment"),
        investment.save()
      ]);

      return true;
    }

    return false;
  }

  public async AddEvent(user: CookieUser, investmentId: string, event: CreateInvestmentEvent): Promise<string> {
    const investment = await InvestmentModel.findById(investmentId);

    event.eventDate = new Date(event.eventDate);

    if (investment == null || investment.userUID !== user.userUID || event.type == "created") {
      return "Investment not found";
    }

    const createdEvent = investment.timelineEvents[0];

    if (!createdEvent) {
      return "Investment not found";
    }

    if (createdEvent.eventDate > new Date(event.eventDate)) {
      return "Cannot add events before the creation date";
    }

    if (event.type !== "adjustment" && event.valueChange.amount <= 0) {
      return "Value must be positive";
    }

    if (event.valueChange.currency !== createdEvent.valueChange.currency) {
      return "Currency must match the initial deposit";
    }

    if (event.type === "withdrawal") {
      const currentValue = investment.timelineEvents.reduce((acc, item) => acc + item.valueChange.amount, 0);

      if (currentValue < event.valueChange.amount) {
        return "Cannot withdraw more than the current value";
      }

      event.valueChange.amount *= -1;
    }

    let title = "Unknown";

    switch (event.type) {
      case "deposit":
        title = `Deposited ${amountForDisplay(event.valueChange)}`;
        break;
      case "withdrawal":
        title = `Withdrawn ${amountForDisplay(event.valueChange)}`;
        break;
      case "adjustment":
        title = `Adjusted value by ${amountForDisplay(event.valueChange)}`;
        break;
    }

    let transactionId: string;
    if (event.updateBalance) {
      const message = event.updateNote || `${capitalise(event.type)} event`;

      transactionId = await this.SubmitCashTransaction(
        {
          amount: event.type === "adjustment" ? event.valueChange.amount : -event.valueChange.amount,
          currency: event.valueChange.currency,
        },
        user,
        `[${investment.title}] ${message}`,
        event.type,
        undefined,
        event.eventDate,
        event.type !== "adjustment"
      );
    }

    const newEvent: IInvestmentEventModel = {
      eventDate: event.eventDate,
      title,
      type: event.type,
      valueChange: event.valueChange,
      transaction: transactionId
    };

    investment.timelineEvents.push(newEvent);
    investment.timelineEvents.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
    investment.dateModified = new Date();

    const savedInvestment = await investment.save();

    return savedInvestment != null ? "" : "Failed to save investment";
  }

  public async GetTotalMoneyValue(currency: Currency, investments: Investment[]): Promise<Money> {
    const result: Money = {
      amount: 0,
      currency,
    };

    for (const investment of investments) {
      const val = await CurrencyRateManager.getInstance().convert(
        investment.currentValue.amount,
        investment.currentValue.currency,
        result.currency
      );

      result.amount += val;
    }

    return result;
  }

  private GetInvestmentCurrency(investment: Investment | InvestmentDocument): Currency {
    return investment.timelineEvents[0]?.valueChange?.currency || "USD";
  }

  public ToSummary(basicInvestments: Investment[]): InvestmentSummary[] {
    return !basicInvestments ? [] : basicInvestments.map(o => ({
      id: o.id,
      title: o.title,
      dateModified: o.dateModified,
      currentValue: o.currentValue,
      timelineEventsCount: o.timelineEvents.length
    } as InvestmentSummary));
  }
}
