import { createSlice } from "@reduxjs/toolkit";

const PopUpSlice = createSlice({
  name: "PopUpSlice",
  initialState: {
    PopUpState : null,
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
   SetPopUpState(state, action) {
     state.PopUpState = action.payload;
   },

   ClosePopUp(state) {
     state.PopUpState = null;
   },

   GetPopUpState(state) {
     return state.PopUpState;
   }
   
  },
});

export const { SetPopUpState, ClosePopUp, GetPopUpState } = PopUpSlice.actions;

export default PopUpSlice.reducer;
