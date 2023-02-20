import KeepAlive from 'react-activation'
import Home from "@/package/views/home/Home";
import Login from "@/package/views/login/Login";
import lazyLoad from "../utils/lazyLoad";
import Loading from "../components/loading/Loading";
import store, { getState } from '@/package/store/index'
import { changeMenus, login } from '@/package/store/loginUserSlice'
import { getSysUserInfo } from '../request/system/user';
import { getRouterOfRole } from '../request/system/router';
import { Route } from 'react-router-dom';
import Root from '@/package/views/Root'



/**
 * 路由对象
 */
export let router = null


/**
 * 在应用初始化时注册路由
 */
export function initRouter(appRouter){
  router = appRouter
}


/**
 * 
 * @param {Array} routers 路由列表
 * @param {Array} arr 最终返回的路由数组
 * @param {string} parentPath 父路由路径
 * @returns 
 */
export function createRoutes(routers, arr = [], parentPath = '', parentTitle = '') {
  if(!Array.isArray(routers) || !routers.length){
    return []
  }
  if (parentPath[0] === "/") {
    parentPath = parentPath.substring(1)
  }
  for (let item of routers) {
    if (item.element) {
      let element = item.element
      if (element[0] === '/') {
        element = element.substring(1)
      };
      routeTitle["/" + parentPath + "/" + item.path] = parentTitle + '-' +item.label
      arr.push(import('@/package/views/' + element).then(({ default: Element }) => {
        return (
          <Route
            key={'route:' + item.path}
            path={parentPath + "/" + item.path}
            element={
              <KeepAlive name={item.element} cacheKey={item.element}>
                <Element />
              </KeepAlive>
            }
          />
        )
      }).catch(e => {
        console.error(e)
      }))
    }
    if (item.children) {
      const path = parentPath + "/" + item.path
      const title = parentTitle ? parentTitle + "-" + item.label : item.label
      createRoutes(item.children, arr, path, title)
    }
  }
  return arr
}



/**
 * 基础组件
 */
export const baseRoutes = [
  {
    path: "*",
    element: <Root />,
    children: [
      {
        path: "*",
        element: <Home />,
        loader: async () => {
          // 如果redux有数据，直接从redux获取
          let userInfo = getState("loginUser.userInfo")
          let menus = getState("loginUser.menus")
          // 如果redux没有数据，通过http获取
          if (!userInfo) {
            userInfo = await getSysUserInfo()
            if (userInfo) {
              menus = await getRouterOfRole(userInfo.roleId)
              // 将数据存入redux
              store.dispatch(login(userInfo))
              if (menus) {
                store.dispatch(changeMenus(menus))
              }
            }
          }
          return {
            userInfo,
            menus
          }
        }
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: lazyLoad(() => import("@/package/views/register/Register"), Loading)
      }
    ]
  }
]



export const routeTitle = {
  "*": "首页",
  "/login": "登录",
  "/register": "注册"
}
