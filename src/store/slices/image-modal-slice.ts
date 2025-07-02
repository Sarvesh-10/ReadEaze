import { createSlice } from "@reduxjs/toolkit";
import { generateImage } from "../actions";

type ImageModalState = {
    isOpen: boolean;
    imageUrl: string;
    isGenerating: boolean;
};



const initialState: ImageModalState = {
    isOpen: false,
    isGenerating: false,
    imageUrl: "",
}

const imageModalSlice = createSlice({
    name: "imageModalSlice",
    initialState: initialState,
    reducers: {
        openImageModal: (state, action: { payload: string }) => {
            state.isOpen = true;
            state.imageUrl = action.payload;
        },
        closeImageModal: (state) => {
            state.isOpen = false;
            state.imageUrl = "";
        },

        
    },
    extraReducers: (builder) => { 
        // Add any extra reducers if needed
        builder.addCase(generateImage.pending, (state) => {
            state.isGenerating = true;
            state.isOpen = true;
        })
        builder.addCase(generateImage.fulfilled, (state, action) => {
            state.isGenerating = false;
            state.imageUrl = action.payload;
            
        })
        builder.addCase(generateImage.rejected, (state) => {
            state.isGenerating = false;
            state.imageUrl = "";
        })
    }   
});
export const { openImageModal, closeImageModal } = imageModalSlice.actions;
export default imageModalSlice.reducer;