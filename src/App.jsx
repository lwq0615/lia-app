import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { useLoadRouter } from "./package/hook/useLoadRouter";
import store from './package/store';


function RouterComponent(){
  const routes = useLoadRouter()
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
