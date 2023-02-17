import KeepAlive, { AliveScope } from 'react-activation'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Index from '@/package/views/system/index/Index'
import { useRef } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import WithRouter from '@/package/components/hoc/WithRouter';
import { useEffect, useState } from 'react'
import { createRoutes } from '@/package/router/index'



function RouterBody(props) {

    // const [routers, setRouters] = useState([])

    // useEffect(() => {
    //     const routers = createRoutes(props.routers)
    //     Promise.all(routers).then(list => {
    //         setRouters(list)
    //     })
    // }, [props.routers])
    const nodeRef = useRef(null)

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
                    <Outlet location={props.location}/>
                    {/* <Routes location={props.location}>
                        <Route exact index path="*" element={<KeepAlive cacheKey='index' name='index'><Index
                            userInfo={props.userInfo}
                            headImg={props.headImg}
                            reloadHeadImg={props.reloadHeadImg}
                        /></KeepAlive>} />
                        {routers}
                    </Routes> */}
                </CSSTransition>
            </SwitchTransition>
        </AliveScope>
    )
}

export default WithRouter(RouterBody)