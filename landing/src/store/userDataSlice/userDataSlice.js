import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserBonus } from "../../API/apiRequest";

// 1. Создаем асинхронный экшен
export const fetchUserBonuses = createAsyncThunk(
  "user/fetchUserBonuses",
  async (_, thunkAPI) => {
    const response = await getUserBonus();
    if (response?.status === 200) {
      return response.data.bonusPoints;
    } else {
      return thunkAPI.rejectWithValue("Ошибка загрузки бонусов");
    }
  }
);

// 2. Создаем slice
const UserSlice = createSlice({
  name: "UserSlice",
  initialState: {
    userBonuses: 0,
  },

  reducers: {
    addBonuses(state, action) {
      const { bonus } = action.payload;
      state.userBonuses = state.userBonuses + bonus;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUserBonuses.fulfilled, (state, action) => {
      state.userBonuses = action.payload;
    });
    builder.addCase(fetchUserBonuses.rejected, (state, action) => {
      console.error(action.payload);
    });
  },
});

// 3. Экспортируем
export const { addBonuses } = UserSlice.actions;
export default UserSlice.reducer;
