import { useEffect, useState } from "react";
import createRouter from "../router/index";
import { getState } from "../store";

export function useLoadRouter() {
  const [routes, setRoutes] = useState(createRouter());

  const meuns = getState("loginUser.menus")
    
  // useEffect监听的是redux/loginUser里面的meuns数据有没有改变
  useEffect(() => {
    const routes = createRouter(meuns);
    setRoutes(routes);
  }, [meuns]);

  return routes;
}