import {
  LOGOUT_USER,
  SET_ALLOCATED_DATA,
  SET_ALLOCATION_DETAILS,
  SET_SLOTS,
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
    case SET_SLOTS:
      return {
        ...state,
        slots: action.payload.slots,
      };
    case SET_ALLOCATION_DETAILS:
      return {
        ...state,
        classCapacity: action.payload.classCapacity,
        deptStrength: action.payload.deptStrength,
        letStrength: action.payload.letStrength,
        exams: action.payload.exams,
        drop: action.payload.drop,
        rejoin: action.payload.rejoin,
        examToday: action.payload.examToday,
      };
    case SET_ALLOCATED_DATA:
      return {
        ...state,
        noticeBoardView: action.payload.noticeBoardView,
        deptView: action.payload.deptView,
        classroomView: action.payload.classroomView,
        classNames: action.payload.classNames,
      };

    default:
      throw new Error(`Undefined Action :${action.type}`);
  }
};
export default reducer;
