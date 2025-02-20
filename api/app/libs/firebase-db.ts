import app from "./firebase-config";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);

export default db;
