import React, { useReducer, useContext } from "react";
// import { CLEAR_ALERT } from "./actions";
import reducer from "./reducers";
import axios from "axios";


const initalState = {
  isLoading: false,
  showAlert: false,

};

const Appcontext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);
  
  return (
    <Appcontext.Provider
      value={{
        ...state,
 
      }}
    >
      {children}
    </Appcontext.Provider>
  );
};
const useAppContext = () => {
  return useContext(Appcontext);
};
export { AppProvider, initalState, useAppContext };
