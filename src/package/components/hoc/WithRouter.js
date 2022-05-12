import { useNavigate } from 'react-router-dom'



export default (Component) => {
    return (props) => <Component {...props} navigate={useNavigate()} />;
}
