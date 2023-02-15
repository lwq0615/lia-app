import KeepAlive, { AliveScope } from 'react-activation'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Index from '@/package/views/system/index/Index'
import { Routes, Route } from 'react-router-dom';
import WithRouter from '@/package/components/hoc/WithRouter';
import { useEffect, useState } from 'react'



/**
 * 动态生成路由组件
 * @returns 
 */
function createRoutes(routers, arr = [], parentPath = '') {
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
                        element={<KeepAlive name={item.element} cacheKey={item.element}><Element /></KeepAlive>} />
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
                        <Route exact index path="*" element={<KeepAlive cacheKey='index' name='index'><Index
                            userInfo={props.userInfo}
                            headImg={props.headImg}
                            reloadHeadImg={props.reloadHeadImg}
                        /></KeepAlive>} />
                        {routers}
                    </Routes>
                </CSSTransition>
            </SwitchTransition>
        </AliveScope>
    )
}

export default WithRouter(RouterBody)