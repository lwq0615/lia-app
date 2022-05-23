import { Layout, Menu, Breadcrumb } from 'antd';
import * as icons from '@ant-design/icons'
import React from 'react';
import '@/package/css/home.scss'
import { Routes, Route } from 'react-router-dom';
import { getSysUserInfo } from '@/package/request/system/user'
import { getRouterOfRole } from '@/package/request/system/router'
import WithRouter from '@/package/components/hoc/WithRouter';
import Index from '@/package/views/Index'


const { Header, Sider, Content } = Layout;

class Home extends React.Component {

    state = {
        collapsed: false,
        routers: [],
        routePath: [],
        routes: [],
        selectedKeys: []
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /**
     * 路由数据映射为导航数据
     * @param {*} router 
     * @returns 
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
    goRouter = (keys, routers) => {
        this.setState({
            selectedKeys: keys || []
        })
        if (!keys || keys.length === 0) {
            this.setState({
                routePath: [<Breadcrumb.Item key='*'>首页</Breadcrumb.Item>],
            })
            this.props.navigate("/")
        } else {
            let list = routers
            this.setState({
                routePath: keys.map(key => {
                    parent = this.findTarget(key, list)
                    list = parent.children
                    return (<Breadcrumb.Item key={key}>{parent.label}</Breadcrumb.Item>)
                })
            })
            //跳转路由展示页面
            if (parent.path[0] === '/') {
                parent.path = parent.path.substring(1)
            }
            this.props.navigate(parent.path)
        }
    }

    findTarget(key, parent = this.state.routers) {
        for (let item of parent) {
            if (item.key === key) {
                return item
            }
        }
    }

    /**
     * 动态生成路由组件
     * @returns 
     */
    createRoutes = async (routers, arr = []) => {
        for (let item of routers) {
            if (item.element) {
                let element = item.element
                if (element[0] === '/') {
                    element = element.substring(1)
                };
                await import('@/package/views/' + element).then(({ default: Element }) => {
                    arr.push(<Route key={'route:' + item.path} exact path={item.path} element={<Element />}></Route>)
                })
            }
            if (item.children) {
                await this.createRoutes(item.children, arr)
            }
        }
        return arr
    }

    /**
     * 根据当前URI获取路由路径
     */
    getPathKeys = (path, list, keyPath = []) => {
        for (let i in list) {
            let item = list[i]
            keyPath.push(item.key)
            if (item.path === path) {
                return keyPath
            } else {
                if (item.children && item.children.length > 0) {
                    let res = this.getPathKeys(path, item.children, keyPath)
                    if (res) {
                        return res
                    }
                } else {
                    keyPath.pop()
                }
            }
        }
        keyPath.pop()
    }

    componentDidMount = () => {
        getSysUserInfo().then(user => {
            getRouterOfRole(user.roleId).then(async routers => {
                routers = this.routerMap(routers)
                this.setState({
                    routers: routers,
                    routes: await this.createRoutes(routers)
                })
                //根据进入时的URI重新渲染视图
                const keyPath = this.getPathKeys(location.pathname, routers)
                if (keyPath) {
                    this.goRouter(keyPath, routers)
                } else {
                    this.goRouter()
                }
            })
        })
    }

    render() {
        return (
            <Layout className='lia_home_container'>
                <Sider collapsed={this.state.collapsed} style={{ overflow: 'auto' }}>
                    <div className="logo" onClick={() => this.goRouter()}>
                        <icons.AmazonCircleFilled />&nbsp;lia
                    </div>
                    <Menu
                        onClick={this.routerClick}
                        theme="dark"
                        mode="inline"
                        selectedKeys={this.state.selectedKeys}
                        items={this.state.routers}
                    />
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {React.createElement(this.state.collapsed ? icons.MenuUnfoldOutlined : icons.MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                        <Breadcrumb style={{ margin: '16px 0', display: 'inline-block' }}>
                            {this.state.routePath}
                        </Breadcrumb>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            overflow: 'auto'
                        }}
                    >
                        <Routes>
                            <Route exact index path="*" element={<Index />} />
                            {this.state.routes}
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default WithRouter(Home);