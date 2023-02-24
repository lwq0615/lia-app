import { Layout, Menu, Breadcrumb } from 'antd';
import * as icons from '@ant-design/icons'
import React from 'react';
import './home.scss'
import WithRouter from '@/package/components/hoc/WithRouter';
import HistoryRouter from './HistoryRouter.tsx'
import HomeHeader from './HomeHeader';
import RouterBody from './RouterBody'
import WithRedux from '@/package/components/hoc/WithRedux'

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
            const Icon = icons[item.icon]
            data.icon = <Icon />
        }
        return data
    })
}


@WithRedux
@WithRouter
export default class Home extends React.Component {

    /**
     * 在请求模块中注册路由跳转
     */
    constructor(props) {
        super(props)
    }

    state = {
        collapsed: false,
        userInfo: this.props.loaderData.userInfo,
        routers: routerMap(this.props.loaderData.menus),
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
     * 点击路由时触发
     * @param {*} e 
     */
    routerClick = (e) => {
        this.goRouter(e.keyPath.reverse(), this.state.routers)
    }


    /**
     * 更新历史菜单，菜单路径，菜单选中项等信息
     */
    updateRouterPath = (keys, routers = this.state.routers) => {
        this.setState({
            selectedKeys: keys || []
        })
        if(!keys){
            this.setState({
                routePath: [(<Breadcrumb.Item key='welcome'>欢迎</Breadcrumb.Item>)]
            })
            return
        }
        let label = ''
        let element = ''
        let list = routers
        let parent = null
        this.setState({
            routePath: keys.map(key => {
                parent = this.findTarget(key, list)
                if (parent) {
                    list = parent.children
                    label = parent.label
                    element = parent.element
                    return (<Breadcrumb.Item key={key}>{parent.label}</Breadcrumb.Item>)
                }
            })
        })
        this.historyRouterRef?.addHistory({
            keyPath: keys.join(","),
            label,
            element
        })
    }

    /**
     * 根据keyPath跳转路由
     */
    goRouter = (keys) => {
        const routers = this.state.routers
        let list = routers
        let parent = null
        let path = ''
        keys?.forEach(key => {
            parent = this.findTarget(key, list)
            if (parent) {
                list = parent.children
                path += "/" + parent.path
            }
        })
        //跳转路由展示页面
        if (path[0] === '/') {
            path = path.substring(1)
        }
        this.props.navigate(path)
        this.updateRouterPath(keys)
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
    getPathKeys = (path = [''], list = this.state.routers, keyPath = []) => {
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
     * 加载路由相关
     */
    componentDidMount = () => {
        //根据进入时的URI重新渲染视图
        let keyPath = this.getPathKeys(location.pathname.substring(1).split("/"))
        this.updateRouterPath(keyPath, this.state.routers)
    }


    render() {
        return (
            <Layout className='lia_home_container'>
                <Sider collapsed={this.state.collapsed} style={{ overflow: 'auto', paddingTop: 15 }} width={230}>
                    <div className='userInfo'>
                        <span style={{ color: '#1890ff', padding: 5}}>
                            {this.state.userInfo?.nick}
                        </span>
                    </div>
                    {
                        this.state.selectedKeys && <Menu
                            onClick={this.routerClick}
                            theme="dark"
                            mode="inline"
                            defaultOpenKeys={this.state.selectedKeys.slice(0, this.state.selectedKeys.length - 1)}
                            selectedKeys={this.state.selectedKeys}
                            items={this.state.routers}
                        />
                    }
                </Sider>
                <Layout className="site-layout">
                    <HomeHeader
                        toggle={this.toggle}
                        userInfo={this.state.userInfo}
                        routePath={this.state.routePath}
                    />
                    <HistoryRouter
                        historyRouterList={this.state.historyRouterList}
                        ref={ref => this.historyRouterRef = ref}
                        goRouter={this.goRouter}
                    />
                    <Content className="content-body">
                        <RouterBody
                            routers={this.state.routers}
                        />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

