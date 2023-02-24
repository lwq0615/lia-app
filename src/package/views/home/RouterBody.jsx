import { AliveScope } from 'react-activation'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Route, Routes } from 'react-router-dom';
import WithRouter from '@/package/components/hoc/WithRouter';
import { useEffect, useState } from 'react'
import { createRoutes } from '@/package/router/index'
import Welcome from '../Welcome';



function RouterBody(props) {

  const [routers, setRouters] = useState([])

  useEffect(() => {
    const routers = createRoutes(props.routers)
    Promise.all(routers).then(list => {
      setRouters(list)
    })
  }, [props.routers])

  return (
    // 路由缓存
    <AliveScope>
      {/* 路由切换过渡动画 */}
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={props.location.key}
          timeout={200}
          classNames="route"
        >
          <Routes location={props.location}>
            {/* 所有路由都不命中时进入欢迎界面 */}
            <Route
              key='welcome'
              path="*"
              element={<Welcome />}
            />
            {routers}
          </Routes>
        </CSSTransition>
      </SwitchTransition>
    </AliveScope>
  )
}

export default WithRouter(RouterBody)