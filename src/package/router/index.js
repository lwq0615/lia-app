import { createBrowserRouter, Route } from "react-router-dom";
import KeepAlive from 'react-activation'
import Home from "@/package/views/home/Home";
import Login from "@/package/views/login/Login";
import lazyLoad from "../utils/lazyLoad";
import Loading from "../components/loading/Loading";

/**
 * 动态生成路由组件
 * @returns 
 */
export function createRoutes(routers, arr = [], parentPath = '') {
  if (parentPath[0] === "/") {
      parentPath = parentPath.substring(1)
  }
  for (let item of routers) {
      if (item.element) {
          let element = item.element
          if (element[0] === '/') {
              element = element.substring(1)
          };
          arr.push(import('@/package/views/' + element).then(({ default: Element }) => {
              return (
                  <Route
                      key={'route:' + item.path}
                      exact
                      path={parentPath + "/" + item.path}
                      element={<KeepAlive name={item.element} cacheKey={item.element}><Element /></KeepAlive>} />
              )
          }).catch(e => {
              console.error(e)
          }))
      }
      if (item.children) {
          createRoutes(item.children, arr, parentPath + "/" + item.path)
      }
  }
  return arr
}


/**
 * 基础组件
 */
const router = createBrowserRouter([
  {
    path: "*",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: lazyLoad(() => import("@/package/views/register/Register"), Loading)
  }
])

export default router