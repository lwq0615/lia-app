import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { baseRoutes, createRouter } from "../router/index";

export function useLoadRouter() {
  const [routes, setRoutes] = useState(baseRoutes);

  const { meuns } = useSelector(
    (state) => ({
      meuns: state.loginUser.meuns,
    }),
    shallowEqual
  );
    
  // useEffect监听的是redux/loginUser里面的meuns数据有没有改变
  useEffect(() => {
    const routes = createRouter(meuns);
    setRoutes(routes);
  }, [meuns]);

  return routes;
}