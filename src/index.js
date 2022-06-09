import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/* 设置antd为中文主题 */}
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
