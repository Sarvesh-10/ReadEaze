import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
// import {reducer } from './reducer';
import reducer from "./reducer";
import imageReducer from "./image-modal-slice";
import menuReducer from "./menuslice";

import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

const rootReducer = combineReducers({
  user: reducer,
  image: imageReducer,
  menu: menuReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define RootState and AppDispatch types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the store
export default store;
