// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTLr-dn4Pf31O8aS4MfpNxCEQwNXbBSH4",
  authDomain: "task-management-166b5.firebaseapp.com",
  projectId: "task-management-166b5",
  storageBucket: "task-management-166b5.appspot.com",
  messagingSenderId: "997956359438",
  appId: "1:997956359438:web:4d5fd70b8b18ed4bee335f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app);

export default app;