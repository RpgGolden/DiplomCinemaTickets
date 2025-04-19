import { createSlice } from "@reduxjs/toolkit";
import { getAllMovies } from "../../API/apiRequest";

const MoviesSlice = createSlice({
  name: "MoviesSlice",
  initialState: {
    MovieData: [],
    selectedRows: {}, // Store selected rows as an object
    selectedImage: null,
    isImageModalOpen: false,
  },

  reducers: {
    setMovieData: (state, action) => {
      state.MovieData = action.payload;
    },
    setSelectedRows: (state, action) => {
      console.log("action.payload", action.payload);
      state.selectedRows = action.payload; // Update selected rows
    },
    getandSetMovieData: (state, action) => {
      getAllMovies().then((resp) => {
        if (resp?.status === 200) {
          action.payload(resp.data); // Update movie data
        }
      });
    },
    openImageModal: (state, action) => {
      state.selectedImage = action.payload;
      state.isImageModalOpen = true;
    },
    closeImageModal: (state) => {
      state.selectedImage = null;
      state.isImageModalOpen = false;
    },
  },
});

export const {
  setMovieData,
  setSelectedRows,
  openImageModal,
  closeImageModal,
  getandSetMovieData,
} = MoviesSlice.actions;

export default MoviesSlice.reducer;
