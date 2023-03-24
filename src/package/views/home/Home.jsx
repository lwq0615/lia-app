import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as icons from '@ant-design/icons'
import { Layout, Menu, Breadcrumb } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import defaultImg from './image/default.jpg'
import { getPicUrl } from "@/package/request/system/file";
import './home.scss'
import HistoryRouter from './HistoryRouter'
import HomeHeader from './HomeHeader';
import RouterBody from './RouterBody'

const { Sider, Content } = Layout;


/**
 * 路由数据映射为导航数据
 */
function routerMap(router) {
  if (!router) {
    return null
  }
  return router.map(item => {
    const data = {
      key: String(item.routerId),
      label: item.label,
      element: item.element,
      path: item.path,
      index: item.index
    }
    if (item.children) {
      data.children = routerMap(item.children)
    }
    if (item.icon) {
      const Icon = (icons)[item.icon]
      data.icon = <Icon />
    }
    return data
  })
}


export default function Home() {

  const [full, setFull] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [routePath, setRoutePath] = useState([])
  const [selectedKeys, setSelectedKeys] = useState(null)
  const historyRouterRef = useRef()
  const userInfo = useSelector((state) => state.loginUser.userInfo)
  const routers = routerMap(useSelector((state) => state.loginUser.menus))

  useEffect(() => {
    //根据进入时的URI重新渲染视图
    let keyPath = getPathKeys(location.pathname.substring(1).split("/"))
    updateRouterPath(keyPath)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.keyCode === 122) {
        setFull(!full)
      }
    })
  }, [])

  /**
   * 点击路由时触发
   * @param {*} e 
   */
  const routerClick = (e) => {
    goRouter(e.keyPath.reverse())
  }


  /**
   * 更新历史菜单，菜单路径，菜单选中项等信息
   */
  const updateRouterPath = (keys, routeList = routers) => {
    setSelectedKeys(keys || [])
    if (!keys) {
      setRoutePath([(<Breadcrumb.Item key='welcome'>欢迎</Breadcrumb.Item>)])
      historyRouterRef?.current?.setActiveRouter(null)
      return
    }
    let label = ''
    let element = ''
    let list = routeList
    let parent = null
    let path = ''
    setRoutePath(keys.map(key => {
      parent = findTarget(key, list)
      path += "/" + parent.path
      if (parent) {
        list = parent.children
        label = parent.label
        element = parent.element
        return (<Breadcrumb.Item key={key}>{parent.label}</Breadcrumb.Item>)
      }
    }))
    historyRouterRef?.current?.addHistory({
      keyPath: keys.join(","),
      pathname: path,
      label,
      element
    })
  }

  /**
   * 根据keyPath跳转路由
   */
  const goRouter = (keys) => {
    let list = routers
    let parent = null
    let path = ''
    keys?.forEach(key => {
      parent = findTarget(key, list)
      if (parent) {
        list = parent.children
        path += "/" + parent.path
      }
    })
    //跳转路由展示页面
    if (path[0] === '/') {
      path = path.substring(1)
    }
    if (location.pathname !== '/' + path) {
      navigate(path)
    }
    updateRouterPath(keys)
  }

  function findTarget(key, parent = routers) {
    if (!parent) {
      return null
    }
    for (let item of parent) {
      if (item.key === key) {
        return item
      }
    }
  }

  /**
   * 根据当前URI获取路由路径
   */
  const getPathKeys = (path = [''], list = routers, keyPath = []) => {
    for (let i in list) {
      let item = list[+i]
      if (item.path === path[0]) {
        keyPath.push(item.key)
        path.splice(0, 1)
        if (path.length) {
          return getPathKeys(path, item.children, keyPath)
        } else {
          return keyPath
        }
      }
    }
  }

  return (
    <Layout className='lia_home_container'>
      <Sider collapsed={collapsed} style={{ overflow: 'auto', paddingTop: 15, display: full ? 'none' : void 0 }} width={230}>
        <div className='userInfo'>
          <img
            src={userInfo.headImg
              ? getPicUrl(userInfo.headImg)
              : defaultImg}
            className="headImg"
            onClick={() => goRouter()}
          />
          <span style={{ color: '#1890ff', padding: 5, cursor: "pointer" }} onClick={() => goRouter()}>
            {!collapsed && userInfo?.nick}
          </span>
        </div>
        {
          selectedKeys && <Menu
            onClick={routerClick}
            theme="dark"
            mode="inline"
            defaultOpenKeys={selectedKeys.slice(0, selectedKeys.length - 1)}
            selectedKeys={selectedKeys}
            items={routers}
          />
        }
      </Sider>
      <Layout className="site-layout">
        <HomeHeader
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
          userInfo={userInfo}
          routePath={routePath}
          style={{ display: full ? 'none' : void 0 }}
        />
        <HistoryRouter
          ref={historyRouterRef}
          goRouter={goRouter}
          style={{ display: full ? 'none' : void 0 }}
        />
        <Content className="content-body">
          <RouterBody routers={routers} />
        </Content>
      </Layout>
    </Layout>
  );

}