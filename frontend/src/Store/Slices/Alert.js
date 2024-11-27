import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openAlert: false,
  alertMsg: '',
  alertSeverity: 'success' | 'error',
};

const alertSlice = createSlice({
  name: "alertState",
  initialState,
  reducers: {
    setAlertOpen: (state, action) => {
      state.openAlert = action.payload;
    },
    setAlertMessage: (state, action) => {
      state.alertMsg = action.payload;
    },
    setAlertSeverity: (state, action) => {
      state.alertSeverity = action.payload;
    },
  }
});

export const { setAlertOpen, setAlertMessage, setAlertSeverity } = alertSlice.actions;

export default alertSlice.reducer;
