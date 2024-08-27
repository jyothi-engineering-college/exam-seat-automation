import React, { useReducer, useContext, createContext } from "react";
import reducer from "./reducers";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
} from "./actions";
import { auth, db } from "../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {  doc, setDoc } from "firebase/firestore";

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

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
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

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    const { username, email, password } = currentUser;

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
          name: username,
          email: email,
        });
        const user={username,email}
        dispatch({
          type: SETUP_USER_SUCCESS,
          payload: { user, alertText },
        });
        addUserToLocalStorage({ user });
      } else {
                console.log(email);

        const data = await signInWithEmailAndPassword(auth, email, password);
        const { user } = data.user;
        
        const userEmail = user.email;

        dispatch({
          type: SETUP_USER_SUCCESS,
          payload: { user, alertText },
        });
        addUserToLocalStorage({ user });
      }
    } catch (error) {
      console.log(error);

      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.message },
      });
      clearAlert();
    }
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromTheLocalStorage();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        logoutUser,
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
