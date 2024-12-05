import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pointsBalance: 0,
  userName: ""
};

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setPointsBalance: (state, action) => {
      state.pointsBalance = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    }
  }
});

export const { setPointsBalance, setUserName } = userSlice.actions;

export default userSlice.reducer;
