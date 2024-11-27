import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  wallet_addr: ''
};

const walletSlice = createSlice({
  name: "walletState",
  initialState,
  reducers: {
    setWalletBalance: (state, action) => {
      state.balance = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.wallet_addr = action.payload;
    }
  }
});

export const { setWalletBalance, setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer;
