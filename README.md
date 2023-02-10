# MoneyCanFly - NextJs project

[MoneyCanFly link](https://money-can-fly.vercel.app/)

This repo contains both **Frontend** and **Backend** code for [*MoneyCanFly*](https://money-can-fly.vercel.app/) idea. As [NextJs](https://nextjs.org/) library is the main driving force for this project, each endpoint runs as a serverless function. Server logic/ UI components and UX design itself were created from scratch, except of some 3rd party libraries. The project is hosted by [Vercel](https://vercel.com/) - original creators of [NextJs](https://nextjs.org/) framework itself.

## About the idea

This project was built to give meaninful financial insights for everyday person. Many adults have difficulties when tracking their total balance or other assets. Most of the time individual's money is split between multiple bank accounts and investment providers. This app gives user an ability to join all of its worth into one place and generate helpful insights. With meaningful insights user can have a better understanding about his current/future financial situation. As a result, user can make better financial choices impacting its future positively. That's why project was named 🕊️**Money Can Fly**🕊️

![image](https://user-images.githubusercontent.com/17089888/218181221-8adfe401-cd38-4f2e-904c-e31d4878049c.png)

## How does it work?

For this app to work we need data:
- Transactions
- Payments
- Investments

Importing transactions from various banks automatically is possible through [Open Banking](https://www.openbanking.org.uk/) initiative. This means that user could see multiple bank accounts balance summary in real-time. In contrast, it's difficult to acquire bank API keys due to legal issues. **MoneyCanFly takes different approach - import bank statements exported as CSV**. Many banks support CSV statements (i.e. Barclays, Revolut, Monzo). Import process will do heavy work to assign spending categories, filter duplicates etc.

![image](https://user-images.githubusercontent.com/17089888/218182250-f2c5dd27-38bf-4eec-b892-c5b86a2e5024.png)

___

## Technical information

Frontend:
1. `ChartJs` chart visualisation tool
1. `DateFns` to interect with dates
1. `PhosporIcons` as an icon package
1. `Recoil` to manage React global state

Backend: 

1. `Firebase` to authenticate the user
1. `IronSession` to safely authorise the user within an API 
1. `Mongoose` to communicate with Mongo Database
1. `currencyAPI` to get historical exchange rates

## Core development libraries:

1. `NextJs` - *ReactJs meta framework*
1. `Sass` - *CSS pre-compiler*
1. `Storybook` - *Component documentation*

## How to run the project locally?

1. `git clone <...>`
1. `cd ./money-can-fly`
1. `yarn install`
1. `yarn dev`

> 📌 Note that without Environment variables (`.env.local` file) the project won't run!

#### ENV variables used
- IRON_SESSION_SECRET
- CURRENCY_API_KEY
- MONGO_URI
- NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Values for each variable are **secret**. But you can acquire your values and experiment with this code (or contact me).

[MoneyCanFly link](https://money-can-fly.vercel.app/)
