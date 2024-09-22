import React, { useReducer, useContext, createContext } from "react";
import reducer from "./reducers";
import {
  LOGOUT_USER,
  SET_ACADEMIC_YEAR,
  SET_ALLOCATED_DATA,
  SET_ALLOCATION_DETAILS,
  SET_SINGLE_CLASS,
  SET_SLOT_LOADING,
  SET_SLOTS,
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
  writeBatch,
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
  classCapacity: {},
  deptStrength: {},
  letStrength: {},
  exams: {},
  sup: {},
  drop: [],
  rejoin: {},
  slots: {},
  examToday: [],
  noticeBoardView: {},
  deptView: {},
  classroomView: [],
  classNames: [],
  singleClassView: [],
  singleClassName: "",
  selectedSlotName: "",
  dateTime: "",
  academicYear: null,
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

  // const batchesForm = async (depts) => {
  //   console.log(depts);

  //   showAlert("loading", "Updating Batch Details ...");
  //   const SubdocRef = doc(firestore, "DeptDetails", "Exams");
  //   const LetdocRef = doc(firestore, "DeptDetails", "LetStrength");
  //   const RegdocRef = doc(firestore, "DeptDetails", "RegularStrength");
  //   const dropdocRef = doc(firestore, "DeptDetails", "Dropped");
  //   const rejoindocRef = doc(firestore, "DeptDetails", "Rejoined");

  //   const getDeptFields = (key) =>
  //     depts.reduce(
  //       (acc, dept) => ({
  //         ...acc,
  //         [dept.name]: dept[key],
  //       }),
  //       {}
  //     );

  //   const SubFields = getDeptFields("initialValues");
  //   const RegFields = getDeptFields("reg");
  //   const LetFields = getDeptFields("let");
  //   const dropFields = getDeptFields("drop");
  //   const rejoinFields = getDeptFields("rejoin");
  //   console.log(RegFields);

  //   try {
  //     await setDoc(SubdocRef, SubFields, { merge: true });
  //     await setDoc(RegdocRef, RegFields, { merge: true });
  //     await setDoc(LetdocRef, LetFields, { merge: true });
  //     await setDoc(dropdocRef, dropFields, { merge: true });
  //     await setDoc(rejoindocRef, rejoinFields, { merge: true });

  //     showAlert("success", "Batch Details Updated Successfully !");
  //   } catch (error) {
  //     showAlert("error", error.message);
  //     throw new Error(`${error.message}`);
  //   }
  // };

  const batchesForm = async (depts) => {
    showAlert("loading", "Updating Batch Details ...");
    const SubdocRef = doc(firestore, "DeptDetails", "Exams");
    const LetdocRef = doc(firestore, "DeptDetails", "LetStrength");
    const RegdocRef = doc(firestore, "DeptDetails", "RegularStrength");
    const dropdocRef = doc(firestore, "DeptDetails", "Dropped");
    const rejoindocRef = doc(firestore, "DeptDetails", "Rejoined");

    const getDeptFields = (key) =>
      depts.reduce((acc, dept) => {
        if (dept[key] !== undefined) {
          // Only include defined fields
          return {
            ...acc,
            [dept.name]: dept[key],
          };
        }
        return acc;
      }, {});

    const SubFields = getDeptFields("initialValues");
    const RegFields = getDeptFields("reg");
    const LetFields = getDeptFields("let");
    const dropFields = getDeptFields("drop");
    const rejoinFields = getDeptFields("rejoin");

    try {
      if (Object.keys(SubFields).length > 0)
        await setDoc(SubdocRef, SubFields, { merge: true });
      if (Object.keys(RegFields).length > 0)
        await setDoc(RegdocRef, RegFields, { merge: true });
      if (Object.keys(LetFields).length > 0)
        await setDoc(LetdocRef, LetFields, { merge: true });
      if (Object.keys(dropFields).length > 0)
        await setDoc(dropdocRef, dropFields, { merge: true });
      if (Object.keys(rejoinFields).length > 0)
        await setDoc(rejoindocRef, rejoinFields, { merge: true });

      showAlert("success", "Batch Details Updated Successfully !");
    } catch (error) {
      showAlert("error", error.message);
      throw new Error(`${error.message}`);
    }
  };
  const fetchBatches = async (academicYear) => {
    console.log(academicYear.year());
    const years = [
      academicYear.year().toString().slice(-2),
      (academicYear.year() - 1).toString().slice(-2),
      (academicYear.year() - 2).toString().slice(-2),
      (academicYear.year() - 3).toString().slice(-2),
    ];
    console.log(years);

    // showAlert("loading", "Fetching Batch Details ...");
    const examsRef = doc(firestore, "DeptDetails", "Exams");
    const regStrengthRef = doc(firestore, "DeptDetails", "RegularStrength");
    const letStrengthRef = doc(firestore, "DeptDetails", "LetStrength");
    const dropRef = doc(firestore, "DeptDetails", "Dropped");
    const rejoinRef = doc(firestore, "DeptDetails", "Rejoined");

    try {
      const [examsSnap, regSnap, letSnap, dropSnap, rejoinSnap] =
        await Promise.all([
          getDoc(examsRef),
          getDoc(regStrengthRef),
          getDoc(letStrengthRef),
          getDoc(dropRef),
          getDoc(rejoinRef),
        ]);

      const formattedData = [];

      if (
        examsSnap.exists() &&
        regSnap.exists() &&
        letSnap.exists() &&
        dropSnap.exists() &&
        rejoinSnap.exists()
      ) {
        // Get all department names that start with the items in the years array
        const filterFields = (data) => {
          return Object.keys(data)
            .filter((key) => years.some((year) => key.startsWith(year)))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
        };

        const examsData = filterFields(examsSnap.data());
        const regData = filterFields(regSnap.data());
        const letData = filterFields(letSnap.data());
        const dropData = filterFields(dropSnap.data());
        const rejoinData = filterFields(rejoinSnap.data());

        // Get all department names (assuming all snaps have the same department keys)
        const deptNames = Object.keys({
          ...examsData,
          ...regData,
          ...letData,
          ...dropData,
          ...rejoinData,
        });

        deptNames.forEach((deptName) => {
          formattedData.push({
            deptName,
            letStrength: letData[deptName] || null,
            regStrength: regData[deptName] || null,
            exams: examsData[deptName] || [],
            drop: dropData[deptName] || null,
            rejoin: rejoinData[deptName] || null,
          });
        });
      }
      console.log(formattedData);

      return formattedData;
    } catch (error) {
      showAlert("error", error.message);
      console.error("Error fetching documents: ", error);
      return [];
    }
  };

  const fetchAcademicYear = async () => {
    const docRef = doc(firestore, "DeptDetails", "AcademicYear");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const yearData = docSnap.data();
        const year = yearData.academicYear;

        if (year !== undefined) {
          dispatch({
            type: SET_ACADEMIC_YEAR,
            payload: { academicYear: dayjs(`${year}-01-01`) },
          });
        } else {
          await setDoc(docRef, { academicYear: dayjs().year() });
          dispatch({
            type: SET_ACADEMIC_YEAR,
            payload: { academicYear: dayjs() },
          });
        }
      } else {
        await setDoc(docRef, { academicYear: dayjs().year() });
        dispatch({
          type: SET_ACADEMIC_YEAR,
          payload: { academicYear: dayjs() },
        });
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return [];
    }
  };
  const updateAcademicYear = async (academicYear, prevYear) => {
    showAlert("loading", `Updating year to ${academicYear.year()}`);

    const docRef = doc(firestore, "DeptDetails", "AcademicYear");

    try {
      const examsDocRef = doc(db, "DeptDetails", "Exams");

      const docRefs = [examsDocRef];

      const updateCollection = async (docRef) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          const currentYear = academicYear.year();
          const yearSuffixes = Object.keys(data).map((key) => key.slice(0, 2));
          const biggestYearSuffix = yearSuffixes.reduce((max, suffix) =>
            suffix > max ? suffix : max
          );

          const updatedData = {};

          for (const key in data) {
            const yearSuffix = key.slice(0, 2);
            const programCode = key.slice(2);
            const yearDifference =
              parseInt(biggestYearSuffix) - parseInt(yearSuffix);

            const newYearSuffix =
              yearDifference >= 0 && yearDifference <= 3
                ? (currentYear - yearDifference).toString().slice(-2)
                : yearSuffix;

            updatedData[newYearSuffix + programCode] = data[key];
          }

          await setDoc(docRef, updatedData, { merge: false });
        }
      };

      // Update all collections
      await Promise.all(docRefs.map(updateCollection));

      // Update academic year
      await updateDoc(docRef, { academicYear: academicYear.year() });

      dispatch({
        type: SET_ACADEMIC_YEAR,
        payload: { academicYear },
      });
      localStorage.removeItem("depts");
      localStorage.removeItem("selectedYear");

      showAlert("success", `Academic year changed to ${academicYear.year()}`);
    } catch (error) {
      console.error(error);

      dispatch({
        type: SET_ACADEMIC_YEAR,
        payload: { academicYear: prevYear },
      });
      showAlert("error", error.message);
    }
  };

  const uploadSubFile = async (workbook, updateProgress, cancelToken) => {
    showAlert("warning", "Deleting current academic data ...");
    const subjectsCollection = collection(db, "Subjects");
    const slotsDocRef = doc(db, "AllExams", "Slots");
    const editedSlotsDocRef = doc(db, "AllExams", "EditedSlots");

    const examsRef = doc(firestore, "DeptDetails", "Exams");
    const regStrengthRef = doc(firestore, "DeptDetails", "RegularStrength");
    const letStrengthRef = doc(firestore, "DeptDetails", "LetStrength");
    const dropRef = doc(firestore, "DeptDetails", "Dropped");
    const rejoinRef = doc(firestore, "DeptDetails", "Rejoined");

    try {
      const querySnapshot = await getDocs(subjectsCollection);

      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      batch.delete(slotsDocRef);
      batch.delete(editedSlotsDocRef);
      batch.delete(examsRef);
      batch.delete(regStrengthRef);
      batch.delete(letStrengthRef);
      batch.delete(dropRef);
      batch.delete(rejoinRef);

      await batch.commit();

      showAlert("success", "All academic data deleted!");

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
        throw new Error("No Workbook Found!");
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

      let processedItems = 0;
      let slotsData = {}; // To accumulate slot data

      for (const sheetName of validSheetNames) {
        if (cancelToken.current === false) break;

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Raw data with headers

        const headers = data[0]; // Extract headers from the first row

        if (!validateHeaders(headers)) {
          throw new Error(`Invalid headers in sheet ${sheetName}`);
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
              // Add courseCode only if it doesn't already exist in the slot
              if (!slotsData[slot].includes(courseCode)) {
                slotsData[slot].push(courseCode);
              }
            });
          }

          // Upload individual subject data to Firestore
          try {
            const courseCodeDept = `${item["SEM"]}_${item["DEPT"]}_${item["COURSE CODE"]}`; // Unique document name

            await setDoc(doc(subjectsCollection, courseCodeDept), item);
            processedItems += 1;

            const percent = Math.round((processedItems / totalItems) * 100);
            updateProgress(percent);
          } catch (docError) {
            throw new Error(
              `Error uploading document for COURSE CODE: ${item["COURSE CODE"]}, ${docError.message} !`
            );
          }
        }
      }
      // Upload the accumulated slots data after processing all subjects

      await setDoc(slotsDocRef, slotsData, { merge: true });
      await setDoc(editedSlotsDocRef, slotsData, { merge: true });

      if (cancelToken.current !== false) {
        showAlert("success", "Subjects and slots updated !");
        updateProgress(100);
      } else {
        showAlert("warning", "Upload Cancelled !");
        throw new Error("Upload Cancelled !");
      }
    } catch (error) {
      updateProgress(0);
      showAlert("error", error.message);
      throw new Error(`${error.message}`);
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
        throw new Error("No Workbook Found!");
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
        throw new Error("No valid sheets found!");
      }

      let totalItems = 0;
      validSheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        totalItems += data.slice(1).filter((row) => row.length > 0).length;
      });

      let processedItems = 0;
      let classesData = {}; // To accumulate classroom data
      let classroomSet = new Set(); // For detecting duplicates

      // Function to find optimal rows and columns array based on the number of desks
      const findRowsAndColumns = (desks) => {
        let rows = Math.floor(Math.sqrt(desks)); // Start with square root for balanced layout
        let columns = Math.ceil(desks / rows);

        while (rows * columns > desks) {
          rows--;
          columns = Math.ceil(desks / rows);
        }

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
          throw new Error(`Invalid headers in sheet ${sheetName}`);
        }

        // Sort the data based on "No:of desks" in descending order and detect duplicates
        const sortedData = data
          .slice(1)
          .filter((row) => row.length > 0)
          .sort((a, b) => {
            const desksA = parseInt(a[2], 10) || 0;
            const desksB = parseInt(b[2], 10) || 0;
            return desksB - desksA;
          });

        sortedData.forEach((row) => {
          if (!cancelToken.current) return; // Check for cancellation

          const item = {};
          headers.forEach((header, index) => {
            item[header] = row[index] ? String(row[index]).trim() : "";
          });

          const classroom = item["Classroom"];
          const desks = parseInt(item["No:of desks"], 10);

          if (classroomSet.has(classroom)) {
            throw new Error(`Duplicate classrooms found: ${classroom}`);
          }
          classroomSet.add(classroom);

          if (classroom && desks) {
            const [rows, columns] = findRowsAndColumns(desks * 2);
            classesData[classroom] = [rows, columns];

            processedItems++;
            const percent = Math.round((processedItems / totalItems) * 100);
            updateProgress(percent);
          }
        });
      }

      // Upload the accumulated classes data to Firebase
      const classesDocRef = doc(db, "Classes", "AvailableClasses");
      const allottedclassesDocRef = doc(db, "Classes", "AllotedClasses");

      await setDoc(classesDocRef, classesData, { merge: true });
      await setDoc(allottedclassesDocRef, classesData, { merge: true });

      if (cancelToken.current) {
        showAlert("success", "Classroom and desk data updated!");
        updateProgress(100);
      } else {
        throw new Error("Upload Cancelled!");
      }
    } catch (error) {
      updateProgress(0);
      showAlert("error", error.message);
      throw new Error(`${error.message}`);
    }
  };

  const fetchSubjects = async () => {
    showAlert("loading", "Fetching Subjects ...");
    const subjectsCollection = collection(db, "Subjects");

    try {
      const querySnapshot = await getDocs(subjectsCollection);
      const subjects = [];
      querySnapshot.forEach((doc) => {
        subjects.push(doc.data());
      });

      return subjects;
    } catch (error) {
      showAlert("error", error.message);

      console.error("Error fetching document: ", error);
      return [];
    }
  };

  const fetchExamOptions = async (selectedYear) => {
    showAlert("loading", "Fetching Options ...");
    try {
      const academicYearSnap = await getDoc(
        doc(db, "DeptDetails", "AcademicYear")
      );
      const yearMap = {
        first_years: ["S1", "S2"],
        second_years: ["S3", "S4"],
        third_years: ["S5", "S6"],
        fourth_years: ["S7", "S8"],
      };
      const fetchArray = yearMap[selectedYear] || [];

      const subjectSnap = await getDocs(
        query(collection(db, "Subjects"), where("SEM", "in", fetchArray))
      );
      let academicYear = academicYearSnap
        .data()
        .academicYear.toString()
        .substring(2, 4);
      const deptDetails = {};

      // Initialize deptDetails arrays
      subjectSnap.forEach((doc) => {
        const { SEM: sem, DEPT: dept } = doc.data();

        const yearOffset = Math.floor((parseInt(sem[1]) - 1) / 2);
        deptDetails[`${academicYear - yearOffset}${dept.substring(0, 2)}`] = [];
      });

      // Populate deptDetails
      subjectSnap.forEach((doc) => {
        const { SEM: sem, DEPT: dept, "COURSE CODE": courseCode } = doc.data();
        const yearOffset = Math.floor((parseInt(sem[1]) - 1) / 2);
        const key = `${academicYear - yearOffset}${dept.substring(0, 2)}`;
        if (!deptDetails[key].includes(courseCode)) {
          deptDetails[key].push(courseCode);
        }
      });

      return Object.keys(deptDetails).map((key) => ({
        name: key,
        options: deptDetails[key],
        initialValues: deptDetails[key],
        reg: 0,
        let: 0,
        drop: [],
        rejoin: [],
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
      throw error;
    }
  };

  const fetchSlots = async () => {
    showAlert("loading", "Fetching Slots ...");
    const slotsDocRef = doc(db, "AllExams", "Slots");
    const editedslotsDocRef = doc(db, "AllExams", "EditedSlots");
    const datetimeDocRef = doc(db, "AllExams", "DateTime");

    try {
      const [editedslotsSnap, slotsSnap, datetimeSnap] = await Promise.all([
        getDoc(editedslotsDocRef),
        getDoc(slotsDocRef),
        getDoc(datetimeDocRef),
      ]);

      if (slotsSnap.exists()) {
        const slotsData = slotsSnap.data();
        const editedSlotsData = editedslotsSnap.data();
        const datetimeData = datetimeSnap.data();

        const formattedData = Object.keys(editedSlotsData).map((slotKey) => {
          const exams = editedSlotsData[slotKey] || [];
          const date = datetimeData ? datetimeData[slotKey] : null;

          return {
            Slot: slotKey,
            Exams: exams,
            Date: Array.isArray(date) ? date.map(dayjs) : null,
            options: slotsData[slotKey] || [], // Append options directly
          };
        });

        const sortedData = formattedData.sort((a, b) =>
          a.Slot.localeCompare(b.Slot)
        );

        return sortedData;
      }
    } catch (error) {
      showAlert("error", error.message);
      console.error("Error fetching documents: ", error);
      return [];
    }
  };

  const updateSlots = async (data) => {
    showAlert("loading", "Updating Slots ...");
    try {
      const updatedData = data.map((slot) => ({
        ...slot,
        Date: Array.isArray(slot.Date)
          ? slot.Date.map((date) => date.toISOString())
          : null,
      }));

      const slotsDocRef = doc(db, "AllExams", "EditedSlots");
      const datetimeDocRef = doc(db, "AllExams", "DateTime");

      // Prepare objects to store updates
      const slotsUpdates = {};
      const datetimeUpdates = {};

      // Process each item from the data
      updatedData.forEach((item) => {
        // Add exams to the slots object
        if (item.Exams) {
          slotsUpdates[item.Slot] = item.Exams;
        }

        // Convert timeRange if Date is present
        if (item.Date) {
          const startTime = item.Date[0];
          const endTime = item.Date[1];

          datetimeUpdates[item.Slot] = [startTime, endTime];
        }
      });

      // Create or update Slots document
      if (Object.keys(slotsUpdates).length > 0) {
        await setDoc(slotsDocRef, slotsUpdates, { merge: true });
      }

      // Create or update DateTime document
      if (Object.keys(datetimeUpdates).length > 0) {
        await setDoc(datetimeDocRef, datetimeUpdates, { merge: true });
      }

      showAlert("success", "Slots Updated Successfully !");
    } catch (error) {
      showAlert("error", error.message);
      console.error(error);
    }
  };

  const updateBatches = async (data) => {
    showAlert("loading", "Updating Batches ...");
    try {
      const examsRef = doc(firestore, "DeptDetails", "Exams");
      const regStrengthRef = doc(firestore, "DeptDetails", "RegularStrength");
      const letStrengthRef = doc(firestore, "DeptDetails", "LetStrength");
      const dropRef = doc(firestore, "DeptDetails", "Dropped");
      const rejoinRef = doc(firestore, "DeptDetails", "Rejoined");

      // Prepare objects to store updates
      const examsUpdates = {};
      const regStrengthUpdates = {};
      const letStrengthUpdates = {};
      const dropUpdates = {};
      const rejoinUpdates = {};

      // Process each item from the data
      data.forEach((item) => {
        examsUpdates[item.deptName] = item.exams;
        regStrengthUpdates[item.deptName] = item.regStrength;
        letStrengthUpdates[item.deptName] = item.letStrength;
        dropUpdates[item.deptName] = item.drop;
        rejoinUpdates[item.deptName] = item.rejoin;
      });

      if (Object.keys(examsUpdates).length > 0) {
        await setDoc(examsRef, examsUpdates, { merge: true });
      }

      if (Object.keys(regStrengthUpdates).length > 0) {
        await setDoc(regStrengthRef, regStrengthUpdates, { merge: true });
      }

      if (Object.keys(letStrengthUpdates).length > 0) {
        await setDoc(letStrengthRef, letStrengthUpdates, { merge: true });
      }

      if (Object.keys(dropUpdates).length > 0) {
        await setDoc(dropRef, dropUpdates, { merge: true });
      }

      if (Object.keys(rejoinUpdates).length > 0) {
        await setDoc(rejoinRef, rejoinUpdates, { merge: true });
      }

      showAlert("success", "Batches Updated Successfully !");
    } catch (error) {
      showAlert("error", error.message);
      console.error(error);
    }
  };

  const fetchExamHalls = async () => {
    showAlert("loading", "Fetching Exam Halls ...");
    const availDocRef = doc(db, "Classes", "AvailableClasses");
    const allotDocRef = doc(db, "Classes", "AllotedClasses");

    try {
      const availdocSnap = await getDoc(availDocRef);
      const allotdocSnap = await getDoc(allotDocRef);

      if (availdocSnap.exists() && allotdocSnap.exists()) {
        const availdocData = availdocSnap.data();
        const allotdocData = allotdocSnap.data();

        const sortedData = Object.keys(availdocData)
          .map((key) => {
            const [rows, columns] = availdocData[key]; // Assuming docData is availdocData
            const totalCapacity = rows * columns;
            return {
              Hall: key,
              Capacity: totalCapacity,
              rowcol: [rows, columns],
              alloted: allotdocData.hasOwnProperty(key),
            };
          })
          .sort((a, b) => a.Hall.localeCompare(b.Hall));

        return sortedData;
      } else {
        return [];
      }
    } catch (error) {
      showAlert("error", error.message);
      console.error("Error fetching document: ", error);
      return [];
    }
  };

  const allotExamHall = async (examhalls) => {
    try {
      if (examhalls.length === 0) {
        return;
      }

      const classDocRef = doc(db, "Classes", "AllotedClasses");
      const updatedData = {};

      for (const hall of examhalls) {
        const { Hall, rowcol } = hall;
        updatedData[Hall] = rowcol;
      }

      await setDoc(classDocRef, updatedData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const fetchslotNames = async () => {
    const slotsDocRef = doc(db, "AllExams", "EditedSlots");

    try {
      const docSnap = await getDoc(slotsDocRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();

        dispatch({
          type: SET_SLOTS,
          payload: { slots: docData },
        });

        const sortedKeys = Object.keys(docData).sort();
        return sortedKeys;
      } else {
        return [];
      }
    } catch (error) {
      showAlert("error", error.message);
      console.error("Error fetching document: ", error);
      return [];
    }
  };

  const fetchExamData = async (examToday, selectedSlotName, prevslot) => {
    dispatch({
      type: SET_SLOT_LOADING,
      payload: {
        isLoading: true,
        selectedSlotName: prevslot,
      },
    });
    const examHallDocRef = doc(db, "Classes", "AllotedClasses");
    const examsDocRef = doc(db, "DeptDetails", "Exams");
    const letDocRef = doc(db, "DeptDetails", "LetStrength");
    const regDocRef = doc(db, "DeptDetails", "RegularStrength");
    const dropDocRef = doc(db, "DeptDetails", "Dropped");
    const rejoinDocRef = doc(db, "DeptDetails", "Rejoined");
    const datetimeDocRef = doc(db, "AllExams", "DateTime");

    try {
      const classSnap = await getDoc(examHallDocRef);
      const examsSnap = await getDoc(examsDocRef);
      const letSnap = await getDoc(letDocRef);
      const regSnap = await getDoc(regDocRef);
      const dropSnap = await getDoc(dropDocRef);
      const rejoinSnap = await getDoc(rejoinDocRef);
      const datetimeSnap = await getDoc(datetimeDocRef);

      if (
        classSnap.exists() &&
        examsSnap.exists() &&
        letSnap.exists() &&
        regSnap.exists() &&
        dropSnap.exists() &&
        rejoinSnap.exists() &&
        datetimeSnap.exists()
      ) {
        const classCapacity = classSnap.data();
        const exams = examsSnap.data();
        const letStrength = letSnap.data();
        const deptStrength = regSnap.data();
        const drop = Object.values(dropSnap.data()).flat();
        const rejoin = rejoinSnap.data();
        const datetimeData = datetimeSnap.data();
        const dateTime = Object.keys(datetimeData)
          .filter((key) => key.startsWith(selectedSlotName))
          .reduce((formatted, key) => {
            const startTime = dayjs(datetimeData[key][0]).format(
              "DD-MM-YYYY | hh:mm A"
            );
            const endTime = dayjs(datetimeData[key][1]).format("hh:mm A");

            // Return the formatted time range
            return `${startTime} - ${endTime}`;
          }, "");
        if (dateTime === "") {
          dispatch({
            type: SET_SLOT_LOADING,
            payload: {
              isLoading: false,
              selectedSlotName: prevslot,
            },
          });
          throw new Error("No date-time data found for the selected slot !");
        }

        dispatch({
          type: SET_ALLOCATION_DETAILS,
          payload: {
            classCapacity,
            deptStrength,
            letStrength,
            exams,
            drop,
            rejoin,
            examToday,
            selectedSlotName,
            dateTime,
          },
        });
      } else {
        dispatch({
          type: SET_SLOT_LOADING,
          payload: {
            isLoading: false,
            selectedSlotName: prevslot,
          },
        });
        showAlert("warning", " Insufficient data for allocating the seats !");
        return [];
      }
    } catch (error) {
      showAlert("error", error.message);
      console.error("Error fetching document: ", error);
      return [];
    }
  };

  const setAllocatedData = (allocatedData) => {
    dispatch({
      type: SET_ALLOCATED_DATA,
      payload: {
        noticeBoardView: allocatedData[0],
        deptView: allocatedData[1],
        classroomView: allocatedData[2],
        classNames: allocatedData[3],
      },
    });
  };
  const setSingleClassView = (singleClassView, className) => {
    dispatch({
      type: SET_SINGLE_CLASS,
      payload: {
        singleClassView,
        singleClassName: className,
      },
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setupUser,
        logoutUser,
        showAlert,
        batchesForm,
        fetchBatches,
        fetchAcademicYear,
        updateAcademicYear,
        uploadSubFile,
        fetchSubjects,
        fetchExamOptions,
        fetchSlots,
        uploadExamhallFile,
        fetchExamHalls,
        updateSlots,
        fetchExamData,
        fetchslotNames,
        setAllocatedData,
        setSingleClassView,
        allotExamHall,
        updateBatches,
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
