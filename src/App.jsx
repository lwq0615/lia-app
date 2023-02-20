import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { baseRoutes } from "./package/router/index";
import store from './package/store';
import React from 'react';



export default function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        {/* 设置中文主题 */}
        <ConfigProvider locale={zhCN}>
          <RouterProvider router={createBrowserRouter(baseRoutes)} />
        </ConfigProvider>
      </Provider>
    </React.StrictMode>
  )
}
