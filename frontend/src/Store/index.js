import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./Slices/Wallet";
import alertReducer from "./Slices/Alert";

export const store = configureStore({
  reducer: {
    walletState: walletReducer,
    alertState: alertReducer,
  },
});