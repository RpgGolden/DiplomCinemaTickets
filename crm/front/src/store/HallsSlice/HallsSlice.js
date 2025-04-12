import { createSlice } from "@reduxjs/toolkit";
import { getAllHalls } from "../../API/apiRequest";

const HallsSlice = createSlice({
  name: "HallsSlice",
  initialState: {
    hallData: [],
    selectedRows: {}, // Store selected rows as an object
    isHallModalOpen: false,
    selectedHall: null,
  },

  reducers: {
    setHallData: (state, action) => {
      state.hallData = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload; // Update selected rows
    },
    getandSetHallData: (state, action) => {
        getAllHalls().then((resp) => {
            if (resp?.status === 200) {
                action.payload(resp.data); // Update hall data
            }
      });
    },
    openHallModal: (state, action) => {
      state.selectedHall = action.payload;
      state.isHallModalOpen = true;
    },
    closeHallModal: (state) => {
      state.selectedHall = null;
      state.isHallModalOpen = false;
    },
  },
});

export const {
  setHallData,
  setSelectedRows,
  openHallModal,
  closeHallModal,
  getandSetHallData,
} = HallsSlice.actions;

export default HallsSlice.reducer;
