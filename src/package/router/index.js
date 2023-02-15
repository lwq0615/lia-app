import { createBrowserRouter, Route } from "react-router-dom";
import KeepAlive from 'react-activation'
import Loading from "../components/loading/Loading";
import React, { Suspense } from "react"



// 路由懒加载
function lazyLoadRouter(imp, Loading) {
  const LazyElement = React.lazy(imp);
  return (
    <Suspense fallback={<Loading />}>
      <LazyElement />
    </Suspense>
  );
}


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

const router = createBrowserRouter([
  {
    path: "*",
    element: lazyLoadRouter(() => import("@/package/views/home/Home"), Loading),
    mate: {
      title: "首页"
    }
  },
  {
    path: "/login",
    element: lazyLoadRouter(() => import("@/package/views/login/Login"), Loading)
  },
  {
    path: "/register",
    element: lazyLoadRouter(() => import("@/package/views/register/Register"), Loading)
  }
])

export default router