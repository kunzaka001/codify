// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5lSYKAubQJv6oFavsa_WDG8efZu7Z_Sw",
  authDomain: "codify-quiz.firebaseapp.com",
  projectId: "codify-quiz",
  storageBucket: "codify-quiz.firebasestorage.app",
  messagingSenderId: "260641229110",
  appId: "1:260641229110:web:ef32de9921af64861b0b97",
  measurementId: "G-4NYKT8RJ3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;