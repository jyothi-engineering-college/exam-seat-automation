import {} from "./actions";
import { initalState } from "./appContext";
const reducer = (state, action) => {
  throw new Error(`no such action:${action.type}`);
};

export default reducer;
