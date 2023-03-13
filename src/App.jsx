import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import moment from "moment";
import "moment/locale/zh-cn";
import zhCN from 'antd/lib/locale/zh_CN';
import { Provider } from 'react-redux';
import { baseRoutes, initRouter } from "./package/router/index";
import store from './package/store';
import { marked } from "marked"
import hl from "highlight.js"

const rendererMD = new marked.Renderer();

marked.setOptions({
  renderer: rendererMD,
  highlight: function(code) {
    return hl.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

moment.locale("zh-cn");


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
