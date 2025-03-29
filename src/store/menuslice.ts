import { createSlice } from "@reduxjs/toolkit";

type MenuState = {
    isOpen: boolean;
    x: number|null;
    y: number|null;
};
const initialMenuState: MenuState = {
    isOpen: false,
    x:null,
    y: null
}


const menuSlice = createSlice({
    name: "menuSlice",
    initialState: initialMenuState,
    reducers: {
        openMenu: (state, action: { payload: { x: number; y: number } }) => {
            state.isOpen = true;
            state.x = action.payload.x;
            state.y = action.payload.y;
        },
        closeMenu: (state) => {
            state.isOpen = false;
            state.x = null;
            state.y = null;
        }
    }
});

export const { openMenu, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;