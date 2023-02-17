import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react';


export default (Component: React.FC | typeof React.Component): React.FC => {
    return (props: object) => (
        <Component {...props} navigate={useNavigate()} location={useLocation()}/>
    )
}
