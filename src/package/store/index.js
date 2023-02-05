import { configureStore } from '@reduxjs/toolkit'
import loginUser from './loginUserSlice'

const store = configureStore({
  reducer: {
    loginUser
  }
})


/**
 * 获取redux内的状态
 */
export function getState(keys){
  const reduxKeys = keys.split(/[./]/)
  let value = void 0
  const state = store.getState()
  for(let i = 0; i < reduxKeys.length; i++){
      if(i === 0){
          value = state[reduxKeys[i]]
      }else{
          value = value[reduxKeys[i]]
      }
  }
  return value.payload
}

export default store