import KeepAlive from 'react-activation'
import Home from "@/package/views/home/Home";
import Login from "@/package/views/login/Login";
import lazyLoad from "../utils/lazyLoad";
import Loading from "../components/loading/Loading";
import store, { getState } from '@/package/store/index'
import { changeMenus, login } from '@/package/store/loginUserSlice'
import { getSysUserInfo } from '../request/system/user';
import { getRouterOfRole } from '../request/system/router';


/**
 * 动态生成路由组件
 * @returns 
 */
export function createRoutes(routers, arr = [], parentPath = '') {
  if(!Array.isArray(routers)){
    return
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
          arr.push({
            path: parentPath + "/" + item.path,
            element: <KeepAlive name={item.element} cacheKey={item.element}>{lazyLoad(import('@/package/views/' + element))}</KeepAlive>
          })
      }
      if (item.children) {
          createRoutes(item.children, arr, parentPath + "/" + item.path)
      }
  }
  return arr
}


// export function createRoutes(routers, arr = [], parentPath = '') {
//   if (parentPath[0] === "/") {
//       parentPath = parentPath.substring(1)
//   }
//   for (let item of routers) {
//       if (item.element) {
//           let element = item.element
//           if (element[0] === '/') {
//               element = element.substring(1)
//           };
//           arr.push(import('@/package/views/' + element).then(({ default: Element }) => {
//               return (
//                   <Route
//                       key={'route:' + item.path}
//                       exact
//                       path={parentPath + "/" + item.path}
//                       element={<KeepAlive name={item.element} cacheKey={item.element}><Element /></KeepAlive>} />
//               )
//           }).catch(e => {
//               console.error(e)
//           }))
//       }
//       if (item.children) {
//           createRoutes(item.children, arr, parentPath + "/" + item.path)
//       }
//   }
//   return arr
// }

/**
 * 基础组件
 */
export const baseRoutes = [
  {
    path: "*",
    id: "main",
    element: <Home/>,
    loader: async () => {
      // 如果redux有数据，直接从redux获取
      let userInfo = getState("loginUser.userInfo")
      let meuns = getState("loginUser.meuns")
      // 如果redux没有数据，通过http获取
      if(userInfo){
        userInfo = await getSysUserInfo()
      }
      if(meuns){
        userInfo = await getRouterOfRole()
      }
      // 将数据存入redux
      store.dispatch(login(userInfo))
      store.dispatch(changeMenus(meuns))
      console.log(userInfo);
      console.log(menus);
      return 1
    }
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: lazyLoad(() => import("@/package/views/register/Register"), Loading)
  }
]

export default function createRouter(routes){
  const router = [...baseRoutes]
  router.find(item => item.id === 'main').children = createRoutes(routes)
  return router
}
