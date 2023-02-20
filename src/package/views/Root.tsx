import { useRouterListen } from '@/package/hook/routerHooks';
import { Outlet } from "react-router-dom";
import { routeTitle } from '../router';
import { initRouter } from "@/package/utils/request"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


/**
 * 入口组件
 * 不能将App当作入口，因为App中没有路由上下文环境
 */
export default function Root(){
  
  const navigate = useNavigate()

  useEffect(() => {
    initRouter(navigate)
  }, [])

  // 监听路由变化，更改页面title
  useRouterListen((location) => {
    document.title = (routeTitle as any)[location.pathname] || (routeTitle as any)["*"]
  })

  return (
    <Outlet/>
  )
}