import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { baseRoutes } from "./package/router/index";
import store from './package/store';
import { initRouter } from './package/router/index';



export default function App() {
  const router = createBrowserRouter(baseRoutes)
  initRouter(router)
  return (
    <Provider store={store}>
      {/* 设置中文主题 */}
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  )
}
