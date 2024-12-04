import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./Slices/Wallet";
import alertReducer from "./Slices/Alert";
import userReducer from "./Slices/User";

export const store = configureStore({
  reducer: {
    walletState: walletReducer,
    alertState: alertReducer,
    userState: userReducer,
  },
});