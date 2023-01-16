import { configureStore } from '@reduxjs/toolkit'
import loginUser from './loginUserSlice'

export default configureStore({
  reducer: {
    loginUser
  }
})