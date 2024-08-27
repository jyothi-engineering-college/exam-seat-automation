import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCZ0WIjGromYtVY-YCaObnwFDkSK7dviVQ",
  authDomain: "exam-seat.firebaseapp.com",
  projectId: "exam-seat",
  storageBucket: "exam-seat.appspot.com",
  messagingSenderId: "526070761477",
  appId: "1:526070761477:web:b9aeba458e5b4634f5b46c",
  measurementId: "G-RQ2Z20YF5X",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);




