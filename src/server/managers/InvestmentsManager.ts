import { CookieUser } from "@server/core";
import { Category, CreateInvestmentEvent, Currency, Investment, Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { InvestmentModel, InvestmentDocument, IInvestmentEventModel } from "@server/models";
import { TransactionManager, PreferencesManager, CurrencyRateManager } from "@server/managers";
import { CreateInvestmentRequest } from "@endpoint/investments/create";
import { InvestmentEventDocument } from "@server/models/mongo/investment/InvestmentModel";

export class InvestmentsManager {
  private async GetDefaultCurrency(user: CookieUser): Promise<Currency> {
    const preferencesManager = new PreferencesManager();
    return await preferencesManager.GetDefaultCurrency(user);
  }

  public async GetInvestments(user: CookieUser): Promise<Investment[]> {
    const investments: InvestmentDocument[] = await InvestmentModel.find({ userUID: user.userUID });
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
    category: Category = "deposits"
  ): Promise<void> {
    if (money.amount === 0) {
      return;
    }

    const transactionManager = new TransactionManager();

    await transactionManager.CreateTransaction(
      {
        amount: money.amount,
        currency: money.currency,
        category,
        date: new Date().toISOString(),
        description,
        source: "cash",
      },
      user
    );
  }

  public async CreateInvestment(user: CookieUser, request: CreateInvestmentRequest): Promise<Investment> {
    const newInvestment = new InvestmentModel({
      title: request.title,
      dateModified: new Date(),
      dateCreated: new Date(),
      timelineEvents: [
        {
          eventDate: new Date(),
          type: "created",
          valueChange: request.initialDeposit,
          title: "Investment created",
        },
      ],
      userUID: user.userUID,
    });

    const savedInvestment = await newInvestment.save();
    const result: Investment = savedInvestment.toJSON();

    result.currentValue = request.initialDeposit;

    if (request.subtractFromBalance) {
      request.initialDeposit.amount *= -1;
      await this.SubmitCashTransaction(request.initialDeposit, user, `Investment: ${request.title}`);
    }

    return result;
  }

  public async DeleteInvestment(user: CookieUser, investmentId: string): Promise<boolean> {
    const investment = await InvestmentModel.findById(investmentId);

    if (investment == null || investment.userUID !== user.userUID) {
      return false;
    }

    const clientModel: Investment = await this.ToInvestment(investment);

    await this.SubmitCashTransaction(clientModel.currentValue, user, `Deleted investment: ${clientModel.title}`);
    await investment.delete();

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

      await this.SubmitCashTransaction(
        {
          amount: toBeDeleted.valueChange.amount,
          currency: toBeDeleted.valueChange.currency,
        },
        user,
        `Deleted investment event: ${toBeDeleted.title}`,
        toBeDeleted.valueChange.amount > 0 ? "trendUp" : "trendDown"
      );

      await investment.save();

      return true;
    }

    return false;
  }

  public async AddEvent(user: CookieUser, investmentId: string, event: CreateInvestmentEvent): Promise<string> {
    const investment = await InvestmentModel.findById(investmentId);

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

    const newEvent: IInvestmentEventModel = {
      eventDate: new Date(event.eventDate),
      title,
      type: event.type,
      valueChange: event.valueChange,
    };

    investment.timelineEvents.push(newEvent);
    investment.timelineEvents.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
    investment.dateModified = new Date();

    if (event.subtractFromBalance && event.type !== "adjustment") {
      await this.SubmitCashTransaction(
        {
          amount: event.valueChange.amount * -1,
          currency: event.valueChange.currency,
        },
        user,
        `Investment event: ${title}`
      );
    }

    const savedInvestment = await investment.save();

    return savedInvestment != null ? "" : "Failed to save investment";
  }

  public async GetTotalMoneyValue(user: CookieUser, investments: Investment[]): Promise<Money> {
    const result: Money = {
      amount: 0,
      currency: await this.GetDefaultCurrency(user),
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
}
