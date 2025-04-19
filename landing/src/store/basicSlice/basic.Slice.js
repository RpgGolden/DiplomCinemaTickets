import { createSlice } from "@reduxjs/toolkit";

const BasicSlice = createSlice({
  name: "BasicSlice",
  initialState: {
    BasicSlice : 1,
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setNumber(state, action) {
      const { number } = action.payload;
      state.BasicSlice = number;
    },

   
  },
});

export const { setNumber } = BasicSlice.actions;

export default BasicSlice.reducer;
