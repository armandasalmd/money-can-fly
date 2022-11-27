
interface FirebaseCertificatesMap {
  [key: string]: string;
}

export class FirebasePublicKey {
  private certificatesMap: FirebaseCertificatesMap;
  private static instance: FirebasePublicKey;
  
  private constructor() { }

  public static getInstance(): FirebasePublicKey {
    if (!FirebasePublicKey.instance) {
      FirebasePublicKey.instance = new FirebasePublicKey();
    }
    return FirebasePublicKey.instance;
  }

  public async getPublicKey(kid: string): Promise<string> {
    if (!this.certificatesMap) {
      const result = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
  
      this.certificatesMap = await result.json();
    }

    return this.certificatesMap[kid];
  }
}