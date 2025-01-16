import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC5lSYKAubQJv6oFavsa_WDG8efZu7Z_Sw",
  authDomain: "codify-quiz.firebaseapp.com",
  projectId: "codify-quiz",
  storageBucket: "codify-quiz.firebasestorage.app",
  messagingSenderId: "260641229110",
  appId: "1:260641229110:web:ef32de9921af64861b0b97",
  measurementId: "G-4NYKT8RJ3N",
};

const app = initializeApp(firebaseConfig);

export default app;
