// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu5vqeg5l4_pwZfEJZqp6d_BJ1AjbCvX0",
  authDomain: "chatproj-62f5c.firebaseapp.com",
  projectId: "chatproj-62f5c",
  storageBucket: "chatproj-62f5c.appspot.com",
  messagingSenderId: "638854187421",
  appId: "1:638854187421:web:d041b6837915da49db8774",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
