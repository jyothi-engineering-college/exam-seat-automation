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
import * as XLSX from "xlsx";

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
  const uploadSubFile = async (workbook, updateProgress, cancelToken) => {
    try {
      const expectedHeaders = [
        "DEPT",
        "SEM",
        "SLOT",
        "COURSE CODE",
        "COURSE NAME",
        "L",
        "T",
        "P",
        "HOURS",
        "CREDIT",
      ];

      const validateHeaders = (headers) => {
        // Check if headers are exactly the same and in the same order
        return JSON.stringify(headers) === JSON.stringify(expectedHeaders);
      };

      if (!workbook) {
        throw new Error("Wrong Format !");
      }

      const sheetNames = workbook.SheetNames;

      const unwantedSheetNames = ["Combined", "Copy of Combined", "LAB"];
      const validSheetNames = sheetNames.filter(
        (name) =>
          !unwantedSheetNames.some((unwantedName) =>
            name.includes(unwantedName)
          )
      );

      const totalSheets = validSheetNames.length;
      let processedSheets = 0;

      const totalItems = validSheetNames.reduce((sum, sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get raw data with headers
        return sum + data.length;
      }, 0);

      let processedItems = 0;

      for (const sheetName of validSheetNames) {
        if (cancelToken.current === false) break;

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get raw data with headers
        // console.log(`Processing sheet: ${sheetName}`, data);

        const headers = data[0]; // Extract headers from the first row
        console.log(headers);

        if (!validateHeaders(headers)) {
          throw new Error("Invalid headers in the sheet!");
        }

        const subjectsCollection = collection(db, "Subjects");

        for (const row of data.slice(1)) {
          // Skip header row
          if (cancelToken.current === false) break;

          const item = {};
          headers.forEach((header, index) => {
            item[header] = row[index];
          });

          const courseCode = item["COURSE CODE"];
          if (courseCode) {
            try {
              // await setDoc(doc(subjectsCollection, courseCode), item);
              processedItems += 1;

              const percent = Math.round((processedItems / totalItems) * 100);
              updateProgress(percent);
            } catch (docError) {
              throw new Error(
                `Error uploading document for COURSE CODE: ${courseCode}`,
                docError.message
              );
            }
          }
        }

        processedSheets += 1;
        const percent = Math.round((processedSheets / totalSheets) * 100);
        updateProgress(percent);
      }

      if (cancelToken.current !== false) {
        console.log("All valid sheets processed!");
        updateProgress(100);
      } else {
        throw new Error("Upload Cancelled !");
      }
    } catch (error) {
      updateProgress(0);

      throw new Error("The file is not in the correct format!");
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
        uploadSubFile,
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
