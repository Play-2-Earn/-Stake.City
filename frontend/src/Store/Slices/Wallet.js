import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  locked_amount: 0,
  wallet_addr: ''
};

const walletSlice = createSlice({
  name: "walletState",
  initialState,
  reducers: {
    setWalletBalance: (state, action) => {
      state.balance = action.payload;
    },
    setLockedAmount: (state, action) => {
      state.locked_amount = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.wallet_addr = action.payload;
    }
  }
});

export const { setWalletBalance, setLockedAmount, setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer;
