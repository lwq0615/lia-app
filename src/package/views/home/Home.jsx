import { Layout, Menu, Breadcrumb } from 'antd';
import * as icons from '@ant-design/icons'
import React from 'react';
import './home.scss'
import { getSysUserInfo, getHeadImg } from '@/package/request/system/user'
import { getRouterOfRole } from '@/package/request/system/router'
import WithRouter from '@/package/components/hoc/WithRouter';
import defaultImg from './image/default.jpg'
import { initRouter } from "@/package/utils/request"
import HistoryRouter from './HistoryRouter.tsx'
import HomeHeader from './HomeHeader';
import RouterBody from './RouterBody'


const { Sider, Content } = Layout;

class Home extends React.Component {

    /**
     * 在请求模块中注册路由跳转
     */
    constructor(props) {
        super(props)
        initRouter(props.navigate)
    }

    state = {
        collapsed: false,
        userInfo: null,
        headImg: null,
        routers: [],
        routePath: [],
        selectedKeys: null,
        historyRouterList: []
    }

    historyRouterRef = null

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /**
     * 路由数据映射为导航数据
     */
    routerMap = (router) => {
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
                data.children = this.routerMap(item.children)
            }
            if (item.icon) {
                const Icon = icons[item.icon]
                data.icon = <Icon />
            }
            return data
        })
    }

    /**
     * 点击路由时触发
     * @param {*} e 
     */
    routerClick = (e) => {
        this.goRouter(e.keyPath.reverse(), this.state.routers)
    }

    /**
     * 根据keyPath跳转路由
     */
    goRouter = (keys = [], routers = this.state.routers) => {
        if(keys?.join("") === this.state.selectedKeys?.join("")){
            return
        }
        this.setState({
            selectedKeys: keys
        })
        let label = ''
        let element = ''
        if (!keys || keys.length === 0) {
            this.setState({
                routePath: [<Breadcrumb.Item key='*'>首页</Breadcrumb.Item>]
            })
            this.props.navigate("/")
            label = '首页'
            element = 'index'
        } else {
            let list = routers
            let parent = null
            let path = ''
            this.setState({
                routePath: keys.map(key => {
                    parent = this.findTarget(key, list)
                    if (parent) {
                        list = parent.children
                        path += "/" + parent.path
                        label = parent.label
                        element = parent.element
                        return (<Breadcrumb.Item key={key}>{parent.label}</Breadcrumb.Item>)
                    }
                })
            })
            //跳转路由展示页面
            if (path[0] === '/') {
                path = path.substring(1)
            }
            this.props.navigate(path)
        }
        this.historyRouterRef.addHistory({
            keyPath: keys.join(","),
            label,
            element
        })
    }

    findTarget(key, parent = this.state.routers) {
        for (let item of parent) {
            if (item.key === key) {
                return item
            }
        }
    }

    /**
     * 根据当前URI获取路由路径
     */
    getPathKeys = (path, list, keyPath = []) => {
        for (let i in list) {
            let item = list[i]
            if (item.path === path[0]) {
                keyPath.push(item.key)
                path.splice(0, 1)
                if (path.length) {
                    return this.getPathKeys(path, item.children, keyPath)
                } else {
                    return keyPath
                }
            }
        }
    }


    /**
     * 加载路由相关和用户信息
     */
    loadUserAndRouter = () => {
        // 获取用户信息
        getSysUserInfo().then(user => {
            this.setState({
                userInfo: user
            })
            // 获取角色可访问的路由
            getRouterOfRole(user.roleId).then(async routers => {
                routers = this.routerMap(routers)
                //根据进入时的URI重新渲染视图
                if (location.pathname === "/") {
                    this.goRouter()
                } else {
                    var keyPath = this.getPathKeys(location.pathname.substring(1).split("/"), routers)
                    this.goRouter(keyPath, routers)
                }
                this.setState({
                    routers
                })
            })
        })
        this.getUserHeadImg()
    }

    getUserHeadImg = () => {
        getHeadImg().then(fileId => {
            this.setState({
                headImg: fileId
            })
        })
    }


    componentDidMount = () => {
        this.loadUserAndRouter()
    }


    render() {
        return (
            <Layout className='lia_home_container'>
                <Sider collapsed={this.state.collapsed} style={{ overflow: 'auto', paddingTop: 15 }} width={230}>
                    <div className='userInfo'>
                        <img
                            src={this.state.headImg
                                ? process.env.REACT_APP_HTTP_URL + "/system/file/getPic?comp=true&fileId=" + this.state.headImg
                                : defaultImg}
                            className="headImg"
                            onClick={() => this.goRouter()}
                        />
                        <span style={{ color: '#1890ff', padding: 5, cursor: "pointer" }} onClick={() => this.goRouter()}>
                            {!this.state.collapsed && this.state.userInfo?.nick}
                        </span>
                    </div>
                    {
                        this.state.selectedKeys
                            ? <Menu
                                onClick={this.routerClick}
                                theme="dark"
                                mode="inline"
                                defaultOpenKeys={this.state.selectedKeys.slice(0, this.state.selectedKeys.length - 1)}
                                selectedKeys={this.state.selectedKeys}
                                items={this.state.routers}
                            />
                            : null
                    }
                </Sider>
                <Layout className="site-layout">
                    <HomeHeader
                        toggle={this.toggle}
                        userInfo={this.state.userInfo}
                        headImg={this.state.headImg} 
                        routePath={this.state.routePath}
                    />
                    <HistoryRouter
                        historyRouterList={this.state.historyRouterList}
                        ref={ref => this.historyRouterRef = ref}
                        goRouter={this.goRouter}
                    />
                    <Content className="content-body">
                        <RouterBody
                            userInfo={this.state.userInfo}
                            headImg={this.state.headImg}
                            reloadHeadImg={this.getUserHeadImg}
                            routers={this.state.routers}
                        />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default WithRouter(Home);