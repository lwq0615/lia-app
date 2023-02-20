import { useRouterListen } from '@/package/hook/routerHooks';
import { Outlet } from "react-router-dom";
import { routeTitle } from '../router';


/**
 * 入口组件
 * 不能将App当作入口，因为App中没有路由上下文环境
 */
export default function Root(){

  // 监听路由变化，更改页面title
  useRouterListen((location) => {
    document.title = (routeTitle as any)[location.pathname] || (routeTitle as any)["*"]
  })

  return (
    <Outlet/>
  )
}