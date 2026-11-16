import { initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

initializeApp();

const db: Firestore = getFirestore();

export { db };
