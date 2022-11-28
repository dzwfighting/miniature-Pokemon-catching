import { combineReducers } from "redux";
import trainerReducer from "./trainerReducer";

const rootReducer = combineReducers({
  trainer: trainerReducer,
});

export default rootReducer;
