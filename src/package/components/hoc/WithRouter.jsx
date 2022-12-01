import { useNavigate, useLocation } from 'react-router-dom'



export default (Component) => {
    return (props) => <Component {...props} navigate={useNavigate()} location={useLocation()}/>;
}
