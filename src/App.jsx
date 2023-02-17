import './App.css';
// import Window from '@/package/components/window/Window'
// electron环境下无法使用BrowserRouter
// import { HashRouter as Router } from 'react-router-dom'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { useLoadRouter } from "./package/hook/useLoadRouter";
import store from './package/store';


function AppRoutes(){
  const routes = useLoadRouter()
  return useRoutes(routes) 
}


export default function App() {
  return (
    <Provider store={store}>
      {/* 设置中文主题 */}
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <AppRoutes/>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  )
}
