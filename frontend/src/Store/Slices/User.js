import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pointsBalance: 0,
};

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setPointsBalance: (state, action) => {
      state.pointsBalance = action.payload;
    },
  }
});

export const { setPointsBalance } = userSlice.actions;

export default userSlice.reducer;
