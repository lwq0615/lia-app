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
            element={<KeepAlive name={item.element} cacheKey={item.element}><Element /></KeepAlive>} 
          />
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
export const baseRoutes = [
  {
    path: "*",
    id: "main",
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
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: lazyLoad(() => import("@/package/views/register/Register"), Loading)
  }
]
