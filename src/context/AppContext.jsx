import React, { useReducer, useContext, createContext } from "react";
import reducer from "./reducers";
import {
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
import { message } from "antd";

const firestore = getFirestore();

const user = localStorage.getItem("user");

const initialState = {
  isLoading: false,
  alertText: "",
  user: user ? JSON.parse(user) : null,
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [messageApi, contextHolder] = message.useMessage();

  const showAlert = (type, content) => {
    messageApi.open({ key: "same_key", type, content });
  };

  const addUserToLocalStorage = ({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeUserFromTheLocalStorage = () => {
    localStorage.removeItem("user");
  };

  const setupUser = async ({ currentUser, endPoint }) => {
    showAlert("loading", "Authenticating...");

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
      showAlert("success", "Login Successful!");
    } catch (error) {
      const errormsg = error.message.split("/")[1];
      dispatch({
        type: SETUP_USER_ERROR,
      });
      showAlert("error", errormsg);
    }
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromTheLocalStorage();
  };

  const examForm = async (depts) => {
    showAlert("loading", "Updating Batch Details ...");
    const docRef = doc(firestore, "DeptDetails", "Exams");

    const updatedFields = depts.reduce(
      (acc, dept) => ({
        ...acc,
        [dept.name]: dept.initialValues,
      }),
      {}
    );

    try {
      await setDoc(docRef, updatedFields, { merge: true });
      showAlert("success", "Batch Details Updated Successfully!");
    } catch (error) {
      showAlert("error", error.message);
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
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.year !== undefined) {
          year = data.year;
        } else {
          await setDoc(docRef, { year });
        }
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
      showAlert("loading", `Updating year to ${year}`);

      await updateDoc(docRef, { year });
      showAlert("success", `Academic year changed to ${year}`);
      return;
    } catch (error) {
      showAlert("error", error.message);
      throw new Error(error.message);
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
        return JSON.stringify(headers) === JSON.stringify(expectedHeaders);
      };

      if (!workbook) {
        showAlert("error", "Wrong Format !");
      }

      const sheetNames = workbook.SheetNames;
      const unwantedSheetNames = ["Combined", "Copy of Combined", "LAB"];
      const validSheetNames = sheetNames.filter(
        (name) =>
          !unwantedSheetNames.some((unwantedName) =>
            name.includes(unwantedName)
          )
      );

      let totalItems = 0;

      // Calculate totalItems excluding headers and empty rows
      validSheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Subtract 1 to account for the header row, and filter out empty rows
        totalItems += data.slice(1).filter((row) => row.length > 0).length;
      });

      console.log(totalItems);

      let processedItems = 0;
      let slotsData = {}; // To accumulate slot data

      for (const sheetName of validSheetNames) {
        if (cancelToken.current === false) break;

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Raw data with headers
        console.log(`Processing sheet: ${sheetName}`);

        const headers = data[0]; // Extract headers from the first row

        if (!validateHeaders(headers)) {
          showAlert("error", "Invalid Headers in the sheet !");
        }

        for (const row of data.slice(1)) {
          if (row.length === 0) continue; // Skip empty rows
          if (cancelToken.current === false) break;

          const item = {};
          headers.forEach((header, index) => {
            // Convert value to string if it exists, then trim it
            item[header] =
              row[index] !== undefined && row[index] !== null
                ? String(row[index]).trim()
                : row[index];
          });

          // Extract course code and slot information for slot upload
          let slot = item["SLOT"];
          const courseCode = item["COURSE CODE"];

          if (slot && courseCode) {
            // Trim the slot and extract only the first letter from each slot
            const slots = slot.split(",").map((s) => s.trim().charAt(0)); // Extract first letter of each slot

            slots.forEach((slot) => {
              if (!slotsData[slot]) {
                slotsData[slot] = [];
              }
              slotsData[slot].push(courseCode);
            });
          }

          // Upload individual subject data to Firestore
          try {
            const subjectsCollection = collection(db, "Subjects");
            const courseCodeDept = `${item["SEM"]}_${item["DEPT"]}_${item["COURSE CODE"]}`; // Unique document name

            // If the document upload succeeds, increment processedItems
            await setDoc(doc(subjectsCollection, courseCodeDept), item);
            processedItems += 1;

            // Calculate percentage progress and update
            const percent = Math.round((processedItems / totalItems) * 100);
            updateProgress(percent);
          } catch (docError) {
            showAlert(
              "error",
              `Error uploading document for COURSE CODE: ${item["COURSE CODE"]}, ${docError.message} !`
            );
          }
        }
      }

      // Upload the accumulated slots data after processing all subjects
      const slotsDocRef = doc(db, "AllExams", "Slots");
      await setDoc(slotsDocRef, slotsData, { merge: true });

      if (cancelToken.current !== false) {
        showAlert("success", "Subjects and slots updated !");
        updateProgress(100);
      } else {
        showAlert("warning", "Upload Cancelled !");
      }
    } catch (error) {
      console.error(error);
      updateProgress(0);
      showAlert("error", error.message);
    }
  };

  const uploadExamhallFile = async (workbook, updateProgress, cancelToken) => {
    try {
      const expectedHeaders = [
        "Semester",
        "Classroom",
        "No:of desks",
        "Department",
      ];

      const validateHeaders = (headers) =>
        JSON.stringify(headers) === JSON.stringify(expectedHeaders);

      if (!workbook) {
        showAlert("error", "No Workbook Found!");
        return;
      }

      const sheetNames = workbook.SheetNames;
      const unwantedSheetNames = ["Combined", "Copy of Combined"];
      const validSheetNames = sheetNames.filter(
        (name) =>
          !unwantedSheetNames.some((unwantedName) =>
            name.includes(unwantedName)
          )
      );

      if (validSheetNames.length === 0) {
        showAlert("error", "No valid sheets found!");
        return;
      }

      let totalItems = 0;
      validSheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        totalItems += data.slice(1).filter((row) => row.length > 0).length;
      });

      let processedItems = 0;
      let classesData = {}; // To accumulate classroom data

      // Function to find optimal rows and columns array based on the number of desks
      const findRowsAndColumns = (desks) => {
        let rows = Math.floor(Math.sqrt(desks)); // Start with the square root for balanced layout
        let columns = Math.ceil(desks / rows);

        // Adjust rows and columns to make sure they don't exceed desks and are closest
        while (rows * columns > desks) {
          rows--;
          columns = Math.ceil(desks / rows);
        }

        // Ensure rows are always greater than or equal to columns
        if (rows < columns) {
          [rows, columns] = [columns, rows]; // Swap rows and columns
        }

        return [rows, columns];
      };

      for (const sheetName of validSheetNames) {
        if (!cancelToken.current) break; // Check for cancellation

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = data[0];

        if (!validateHeaders(headers)) {
          showAlert("error", `Invalid headers in sheet ${sheetName}`);
          return;
        }

        data.slice(1).forEach((row) => {
          if (row.length === 0) return; // Skip empty rows
          if (!cancelToken.current) return; // Check for cancellation

          const item = {};
          headers.forEach((header, index) => {
            item[header] = row[index] ? String(row[index]).trim() : "";
          });

          const classroom = item["Classroom"];
          const desks = parseInt(item["No:of desks"], 10);

          if (classroom && desks) {
            const [rows, columns] = findRowsAndColumns(desks); // Get optimal rows and columns array
            classesData[classroom] = [rows, columns]; // Store as an array of [rows, columns]

            processedItems++;
            const percent = Math.round((processedItems / totalItems) * 100);
            updateProgress(percent);
          }
        });
      }

      // Upload the accumulated classes data to Firebase
      const classesDocRef = doc(db, "Classes", "AvailableClasses");
      await setDoc(classesDocRef, classesData, { merge: true });

      if (cancelToken.current) {
        showAlert("success", "Classroom and desk data updated!");
        updateProgress(100);
      } else {
        showAlert("warning", "Upload Cancelled!");
      }
    } catch (error) {
      console.error(error);
      updateProgress(0);
      showAlert("error", error.message);
    }
  };

  const fetchSubjects = async () => {
    const subjectsCollection = collection(db, "Subjects");

    try {
      const querySnapshot = await getDocs(subjectsCollection);
      const subjects = [];
      querySnapshot.forEach((doc) => {
        subjects.push(doc.data());
      });

      return subjects;
    } catch (error) {
      console.error("Error fetching document: ", error);
      return [];
    }
  };

  const fetchExamOptions = async () => {
    try {
      // Fetch data from Firestore
      const subjectsCollection = collection(db, "Subjects");
      const querySnapshot = await getDocs(subjectsCollection);

      // Create an object to store options for each department
      const fetchedOptions = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dept = data["DEPT"].substring(0, 2); // Get the first two letters of the department name
        const courseCode = data["COURSE CODE"];

        if (dept && courseCode) {
          if (!fetchedOptions[dept]) {
            fetchedOptions[dept] = [];
          }
          if (!fetchedOptions[dept].includes(courseCode)) {
            fetchedOptions[dept].push(courseCode);
          }
        }
      });

      return fetchedOptions; // Return the fetched options
    } catch (error) {
      console.error("Error fetching options:", error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  const fetchSlots = async () => {
    const slotsDocRef = doc(db, "AllExams", "Slots");

    try {
      const docSnap = await getDoc(slotsDocRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const sortedData = Object.keys(docData)
          .map((key) => ({ Slot: key, Exams: docData[key] }))
          .sort((a, b) => a.Slot.localeCompare(b.Slot));
        return sortedData;
      } else {
        console.log("No such document!");
        return {};
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return {};
    }
  };

  const fetchExamHalls = async () => {
    const slotsDocRef = doc(db, "Classes", "AvailableClasses");

    try {
      const docSnap = await getDoc(slotsDocRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const sortedData = Object.keys(docData)
          .map((key) => {
            const [rows, columns] = docData[key]; // Destructure rows and columns from array
            const totalCapacity = rows * columns; // Calculate total capacity
            return { Hall: key, Capacity: totalCapacity }; // Return with calculated capacity
          })
          .sort((a, b) => a.Hall.localeCompare(b.Hall)); // Sort based on hall name (fixed the sort key)
        return sortedData;
      } else {
        console.log("No such document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setupUser,
        logoutUser,
        showAlert,
        examForm,
        fetchBatches,
        fetchAcademicYear,
        updateAcademicYear,
        uploadSubFile,
        fetchSubjects,
        fetchExamOptions,
        fetchSlots,
        uploadExamhallFile,
        fetchExamHalls,
      }}
    >
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider, initialState, useAppContext };
