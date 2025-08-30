// generate use selector hooks for each slice of the state
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "./store";

export const useUserSelector: TypedUseSelectorHook<RootState> = useSelector;