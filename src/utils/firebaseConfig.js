// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ0WIjGromYtVY-YCaObnwFDkSK7dviVQ",
  authDomain: "exam-seat.firebaseapp.com",
  projectId: "exam-seat",
  storageBucket: "exam-seat.appspot.com",
  messagingSenderId: "526070761477",
  appId: "1:526070761477:web:b9aeba458e5b4634f5b46c",
  measurementId: "G-RQ2Z20YF5X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
