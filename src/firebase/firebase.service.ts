import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Database } from "firebase-admin/lib/database/database";
import "dotenv/config";

const serviceAccount = () => {
  return {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  };
};

@Injectable()
export class FirebaseService {
  private database: Database;
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccount() as admin.ServiceAccount,
      ),
      databaseURL: process.env.FIREBASE_RTDB_URL,
    });
    this.database = admin.database();
  }

  // set은 해당 경로의 내용 상관 없이 입력한 데이터로 변경
  // push는 새로운 키를 만들고 그 밑에 입력한 데이터 추가
  async push(path: string, data) {
    const ref = this.getRef(path);
    await ref.push(data);
  }

  async set(path: string, data) {
    const ref = this.getRef(path);
    await ref.set(data);
  }

  // set은 내용 상관 없이 입력한 데이터로 변경
  // update는 있는 데이터만 업데이트 및 추가
  async update(path: string, data) {
    const ref = this.getRef(path);
    await ref.update(data);
  }

  async remove(path: string) {
    const ref = this.getRef(path);
    await ref.remove();
  }

  async get(path: string) {
    const ref = this.getRef(path);
    return (await ref.get()).val();
  }

  async isExist(path: string) {
    const ref = this.getRef(path);
    const snapshot = await ref.once("value");
    return snapshot.exists();
  }

  private getRef(path: string) {
    return this.database.ref(path);
  }
}
