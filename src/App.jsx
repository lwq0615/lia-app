import './App.css';
import React, { Suspense } from "react"
// import Window from '@/package/components/window/Window'
// electron环境下无法使用BrowserRouter
// import { HashRouter as Router } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import store from './package/store';
import { Route, Routes } from 'react-router-dom'
import Loading from './package/components/loading/Loading';


async function getApp() {
  const { default: Home } = await import("./package/views/home/Home")
  const { default: Login } = await import("./package/views/login/Login")
  const { default: Register } = await import("./package/views/register/Register")
  return {
    default: () => (
      <Provider store={store}>
        {/* 设置中文主题 */}
        <ConfigProvider locale={zhCN}>
          <Router>
            {/* <Window> */}
            <Routes>
              <Route exact index path='*' element={<Home />} />
              <Route exact index path='/login' element={<Login />} />
              <Route exact index path='/register' element={<Register />} />
            </Routes>
            {/* </Window> */}
          </Router>
        </ConfigProvider>
      </Provider>
    )
  }
}

const AppComponent = React.lazy(getApp)


class App extends React.Component {

  render() {
    return (
      <Suspense fallback={<Loading />}>
        <AppComponent />
      </Suspense>
    )
  }
}

export default App
