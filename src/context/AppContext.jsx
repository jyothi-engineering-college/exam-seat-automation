import React, { useReducer, useContext, createContext } from "react";
import reducer from "./reducers";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  LOGOUT_USER,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
} from "./actions";
import { auth, db } from "../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import dayjs from "dayjs";

const firestore = getFirestore();

const user = localStorage.getItem("user");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  user: user ? JSON.parse(user) : null,
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = (msg) => {
    dispatch({
      type: DISPLAY_ALERT,
      payload: { msg },
    });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeUserFromTheLocalStorage = () => {
    localStorage.removeItem("user");
  };

  const setupUser = async ({ currentUser, endPoint }) => {
    const { username, email, password } = currentUser;
    let user = {};
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      if (endPoint === "register") {
        const data = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const createUser = data.user;
        await setDoc(doc(db, "users", createUser.uid), {
          username: username,
          email: email,
        });
        user = { username, email };
      } else {
        let data = await signInWithEmailAndPassword(auth, email, password);
        const userEmail = data.user.email;

        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const { username, email } = doc.data();
            user = { username, email };
          });
        }
      }
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user },
      });
      addUserToLocalStorage({ user });
    } catch (error) {
      const errormsg = error.message.split("/")[1];
      dispatch({
        type: SETUP_USER_ERROR,
      });
      displayAlert(errormsg);

      clearAlert();
    }
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromTheLocalStorage();
  };

  const examForm = async (depts) => {
    const docRef = doc(firestore, "DeptDetails", "Exams");

    const updatedFields = depts.reduce(
      (acc, dept) => ({
        ...acc,
        [dept.name]: dept.options,
      }),
      {}
    );

    try {
      await updateDoc(docRef, updatedFields);
      return "Form Submitted!";
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  const fetchBatches = async () => {
    const docRef = doc(firestore, "DeptDetails", "Exams");

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        const formattedData = Object.keys(data).map((deptName) => ({
          deptName,
          subjects: data[deptName],
        }));

        return formattedData;
      } else {
        console.log("No such document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return [];
    }
  };
  const fetchAcademicYear = async () => {
    const docRef = doc(firestore, "DeptDetails", "AcademicYear");
    try {
      let year = dayjs().year();
      const docSnap = await getDoc(docRef);
      if (docSnap.data().year !== undefined) {
        year = docSnap.data().year;
      } else {
        await setDoc(docRef, { year });
      }
      return year;
    } catch (error) {
      console.error("Error fetching document: ", error);
      return [];
    }
  };
  const updateAcademicYear = async (year) => {
    const docRef = doc(firestore, "DeptDetails", "AcademicYear");

    try {
      const examsDocRef = doc(db, "DeptDetails", "Exams");
      const examsDocSnap = await getDoc(examsDocRef);

      if (examsDocSnap.exists()) {
        const examsData = examsDocSnap.data();
        console.log(examsData);
      }
      
      await updateDoc(docRef, { year });
      return year;
    } catch (error) {
      console.error("Error fetching document: ", error);
      throw new Error(`${error.message}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        logoutUser,
        examForm,
        fetchBatches,
        fetchAcademicYear,
        updateAcademicYear,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider, initialState, useAppContext };
