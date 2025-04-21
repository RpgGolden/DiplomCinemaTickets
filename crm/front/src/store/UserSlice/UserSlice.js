import { createSlice } from "@reduxjs/toolkit";

const UserData = createSlice({
  name: "UserData",
  initialState: {
    userData : null,
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setUserData(state, action) {
        state.userData = action.payload;
    },
    clearUserData(state) {
        state.userData = null;
    },
   
  },
});

export const { setUserData, clearUserData } = UserData.actions;

export default UserData.reducer;
