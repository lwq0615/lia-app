import './App.css';
import React from "react"
// import Window from '@/package/components/window/Window'
// electron环境下无法使用BrowserRouter
// import { HashRouter as Router } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import store from './package/store';
import router from "./package/router/index"


class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        {/* 设置中文主题 */}
        <ConfigProvider locale={zhCN}>
          <RouterProvider router={router}/>
        </ConfigProvider>
      </Provider>
    )
  }
}

export default App
