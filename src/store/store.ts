import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
// import {reducer } from './reducer';
import reducer from "./slices/reducer";
import imageReducer from "./slices/image-modal-slice";
import menuReducer from "./slices/menuslice";
import bookreducer from "./slices/bookSlice";
import loading from "./slices/loadingslice";

import {
  TypedUseSelectorHook,
  
  useSelector,
  
} from "react-redux";

const rootReducer = combineReducers({
  user: reducer,
  image: imageReducer,
  menu: menuReducer,
  books: bookreducer,
  loading: loading
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
