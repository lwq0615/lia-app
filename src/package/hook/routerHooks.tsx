import { Location, useLocation } from "react-router-dom";
import { useEffect } from "react";


/**
 * 监听路由变化
 */
export function useRouterListen(toDo: (location: Location) => void) {
  const location = useLocation()
  useEffect(() => {
    toDo(location)
  }, [location])
}