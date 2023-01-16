import { createSlice } from "@reduxjs/toolkit";


const userInfo = createSlice({
    name: "loginUser",
    initialState: {
        userInfo: {}
    },
    reducers: {
        login(state, userInfo) {
            state.userInfo = userInfo
        }
    }
})

export const { login } = userInfo.actions

export default userInfo.reducer