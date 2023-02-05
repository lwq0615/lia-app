import React from 'react';
import { useDispatch } from 'react-redux'
import { getState } from '@/package/store';


export default (Component: typeof React.Component | React.FC): React.FC => {
    return (props:any) => (<Component {...props} dispatch={useDispatch()} getReduxState={getState}/>)
}
