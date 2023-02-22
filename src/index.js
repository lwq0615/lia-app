import ReactDOM from 'react-dom'
import './index.css';
import reportWebVitals from './reportWebVitals';
import moment from "moment";
import "moment/locale/zh-cn";
import lazyLoad from './package/utils/lazyLoad';
import RoundLoading from './package/components/loading/RoundLoading';

moment.locale("zh-cn");

ReactDOM.render(lazyLoad(() => import("./App"), RoundLoading), document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
