import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";
import { CurrencyRateModel, Collection, BaseModel } from "@server/models";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        ...serviceAccount,
        private_key: process.env.FIRESTORE_PRIVATE_KEY.replaceAll("\\n", "\n")
      } as any)
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const converter = <T extends BaseModel>() => ({
  toFirestore: (data: T ) => data,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => ({
    ...snapshot.data(),
    UID: snapshot.id,
    dateChanged: snapshot.updateTime.toDate(),
    dateCreated: snapshot.createTime.toDate()
  } as T)
});

const firestore = admin.firestore();

const dataPoint = <T extends BaseModel>(collection: Collection) => firestore.collection(collection).withConverter(converter<T>());

export const CurrencyRate = dataPoint<CurrencyRateModel>("currencyRate");

export default firestore;