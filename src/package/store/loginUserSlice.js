import { createSlice } from "@reduxjs/toolkit";


const userInfo = createSlice({
    name: "loginUser",
    initialState: {
        userInfo: null,
        meuns: null
    },
    reducers: {
        login(state, userInfo) {
            state.userInfo = userInfo
        },
        changeMenus(state, meuns) {
            state.meuns = meuns
        }
    }
})

export const { login } = userInfo.actions

export default userInfo.reducer