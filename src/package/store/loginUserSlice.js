import { createSlice } from "@reduxjs/toolkit";


const userInfo = createSlice({
    name: "loginUser",
    initialState: {
        userInfo: null,
        menus: null
    },
    reducers: {
        login(state, { payload }) {
            state.userInfo = payload
        },
        changeMenus(state, { payload }) {
            state.menus = payload
        }
    }
})

export const { login, changeMenus } = userInfo.actions

export default userInfo.reducer