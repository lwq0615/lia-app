import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { useSelector, shallowEqual } from "react-redux"
import createRouter from "./package/router/index";
import store from './package/store';
import { useEffect, useState } from "react";


function RouterComponent(){

  const [routes, setRoutes] = useState(createRouter());

  const menus = useSelector(state => {
    return state.loginUser.menus
  }, shallowEqual);
    
  // useEffect监听的是redux/loginUser里面的menus数据有没有改变
  useEffect(() => {
    const routes = createRouter(menus);
    setRoutes(routes);
  }, [menus]);
  return <RouterProvider router={createBrowserRouter(routes)}/>
}


export default function App() {
  return (
    <Provider store={store}>
      {/* 设置中文主题 */}
      <ConfigProvider locale={zhCN}>
        <RouterComponent/>
      </ConfigProvider>
    </Provider>
  )
}
