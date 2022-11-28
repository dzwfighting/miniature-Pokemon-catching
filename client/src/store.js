import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./Reducers/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { createStore } from "redux";

const store = configureStore({ reducer: rootReducer }, composeWithDevTools());

export default store;
