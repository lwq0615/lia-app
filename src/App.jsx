import './App.css';
import React from "react"
import Home from '@/package/views/home/Home'
import Login from '@/package/views/login/Login'
// import Window from '@/package/components/window/Window'
import { Route, Routes } from 'react-router-dom'
// electron环境下无法使用BrowserRouter
// import { HashRouter as Router } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import store from './package/store';

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        {/* 设置中文主题 */}
        <ConfigProvider locale={zhCN}>
          <Router>
            {/* <Window> */}
            <Routes>
              <Route exact index path='*' element={<Home />} />
              <Route exact index path='/login' element={<Login />} />
            </Routes>
            {/* </Window> */}
          </Router>
        </ConfigProvider>
      </Provider>
    )
  }
}

export default App
