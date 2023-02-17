import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { useSelector, shallowEqual } from "react-redux"
import createRouter from "./package/router/index";
import store from './package/store';


function RouterComponent(){

  /**
   * redux中的menus改变时重新渲染组件
   */
  const menus = useSelector(state => {
    return state.loginUser.menus
  }, shallowEqual);

  const routes = createRouter(menus)
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
