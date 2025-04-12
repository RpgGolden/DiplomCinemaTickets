import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import PopUpSlice from "./PopUpSlice/PopUpSlice.js";
import MoviesSlice from "./MoviesSlice/MoviesSlice.js";
import HallsSlice from "./HallsSlice/HallsSlice.js";
import SessionsSlice from "./SessionsSlice/SessionsSlice.js";
import PromotionsSlice from "./PromotionsSlice/PromotionsSlice.js";
import UserSlice from "./UserSlice/UserSlice.js";

const rootReducer = combineReducers({
  PopUpSlice: PopUpSlice,
  MoviesSlice: MoviesSlice,
  HallsSlice: HallsSlice,
  SessionsSlice: SessionsSlice,
  PromotionsSlice: PromotionsSlice,
  UserSlice: UserSlice
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["PopUpSlice", "MoviesSlice", "HallsSlice", "SessionsSlice", "PromotionsSlice", "UserSlice"],
  // blacklist: ["editColumTableSlice", "isCheckedSlice"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
