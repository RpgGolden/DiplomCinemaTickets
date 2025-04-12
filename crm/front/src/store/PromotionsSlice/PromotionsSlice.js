import { createSlice } from "@reduxjs/toolkit";
import { getAllPromotions } from "../../API/apiRequest";

const PromotionsSlice = createSlice({
  name: "PromotionsSlice",
  initialState: {
    promotionsData: [],
    promotionsRows: {},
    selectedPromotion: null,
    isPromotionModalOpen: false,
  },

  reducers: {
    setPromotionData: (state, action) => {
      state.promotionsData = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    getAndSetPromotionData: (state, action) => {
        getAllPromotions().then((resp) => {
            if (resp?.status === 200) {
                action.payload(resp.data);
            }
        });
    },
    openPromotionModal: (state, action) => {
      state.selectedPromotion = action.payload;
      state.isPromotionModalOpen = true;
    },
    closePromotionModal: (state) => {
      state.selectedPromotion = null;
      state.isPromotionModalOpen = false;
    },
  },
});

export const {
  setPromotionData,
  setSelectedRows,
  getAndSetPromotionData,
  openPromotionModal,
  closePromotionModal,
} = PromotionsSlice.actions;

export default PromotionsSlice.reducer;
