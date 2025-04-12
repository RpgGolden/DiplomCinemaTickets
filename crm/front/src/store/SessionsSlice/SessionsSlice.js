import { createSlice } from "@reduxjs/toolkit";
import { getAllSessions } from "../../API/apiRequest";

const SessionsSlice = createSlice({
  name: "SessionsSlice",
  initialState: {
    sessionData: [],
    selectedRows: {},
    selectedSession: null,
    isSessionModalOpen: false,
  },

  reducers: {
    setSessionData: (state, action) => {
      state.sessionData = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    getAndSetSessionData: (state, action) => {
      getAllSessions().then((resp) => {
        if (resp?.status === 200) {
          action.payload(resp.data);
        }
      });
    },
    openSessionModal: (state, action) => {
      state.selectedSession = action.payload;
      state.isSessionModalOpen = true;
    },
    closeSessionModal: (state) => {
      state.selectedSession = null;
      state.isSessionModalOpen = false;
    },
  },
});

export const {
  setSessionData,
  setSelectedRows,
  getAndSetSessionData,
  openSessionModal,
  closeSessionModal,
} = SessionsSlice.actions;

export default SessionsSlice.reducer;
