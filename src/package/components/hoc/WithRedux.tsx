import React from 'react';
import { useDispatch } from 'react-redux'
import store from '@/package/store';


/**
 * 获取redux内的状态
 */
function getState(keys:string){
    const reduxKeys = keys.split(/[./]/)
    let value:any = void 0
    const state:any = store.getState()
    for(let i = 0; i < reduxKeys.length; i++){
        if(i === 0){
            value = state[reduxKeys[i]]
        }else{
            value = value[reduxKeys[i]]
        }
    }
    return value.payload
}


export default (Component: typeof React.Component | React.FC): React.FC => {
    return (props:any) => (<Component {...props} dispatch={useDispatch()} getReduxState={getState}/>)
}
