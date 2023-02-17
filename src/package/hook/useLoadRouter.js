import { useEffect, useState } from "react";
import createRouter from "../router/index";
import { useSelector, shallowEqual } from "react-redux"



export function useLoadRouter() {

  const [routes, setRoutes] = useState(createRouter());

  const menus = useSelector(state => {
    return state.loginUser.menus
  }, shallowEqual);
    
  // useEffect监听的是redux/loginUser里面的menus数据有没有改变
  useEffect(() => {
    const routes = createRouter(menus);
    setRoutes(routes);
  }, [menus]);

  return routes;
}