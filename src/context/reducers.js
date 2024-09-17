import {
  LOGOUT_USER,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
} from "./actions";
import { initialState } from "./AppContext";
const reducer = (state, action) => {
  switch (action.type) {

    case SETUP_USER_BEGIN:
      return { ...state, isLoading: true };

    case SETUP_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
      };

    case SETUP_USER_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case LOGOUT_USER:
      return {
        ...initialState,
        user: null,
      };

    default:
      throw new Error(`Undefined Action :${action.type}`);
  }
};
export default reducer;
