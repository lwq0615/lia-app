import { Layout, Menu, Breadcrumb, Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import * as icons from '@ant-design/icons'
import React from 'react';
import './home.scss'
import { Routes, Route } from 'react-router-dom';
import { getSysUserInfo } from '@/package/request/system/user'
import { getRouterOfRole } from '@/package/request/system/router'
import WithRouter from '@/package/components/hoc/WithRouter';
import Index from '@/package/views/index/Index'
import { http } from "@/config"


const { Header, Sider, Content } = Layout;

class Home extends React.Component {

    state = {
        collapsed: false,
        userInfo: null,
        routers: [],
        routePath: [],
        routes: [],
        selectedKeys: null
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
    goRouter = (keys = [], routers) => {
        this.setState({
            selectedKeys: keys
        })
        if (!keys || keys.length === 0) {
            this.setState({
                routePath: [<Breadcrumb.Item key='*'>首页</Breadcrumb.Item>],
            })
            this.props.navigate("/")
        } else {
            let list = routers
            let parent = null
            let path = ''
            this.setState({
                routePath: keys.map(key => {
                    parent = this.findTarget(key, list)
                    list = parent.children
                    path += "/" + parent.path
                    return (<Breadcrumb.Item key={key}>{parent.label}</Breadcrumb.Item>)
                })
            })
            //跳转路由展示页面
            if (path[0] === '/') {
                path = path.substring(1)
            }
            this.props.navigate(path)
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
    createRoutes = async (routers, arr = [], parentPath = '') => {
        for (let item of routers) {
            if (item.element) {
                let element = item.element
                if (element[0] === '/') {
                    element = element.substring(1)
                };
                try{
                    await import('@/package/views/' + element).then(({ default: Element }) => {
                        arr.push(<Route key={'route:' + item.path} exact path={parentPath + "/" + item.path} element={<Element />}></Route>)
                    })
                }catch(e){
                    console.error(e)
                }
            }
            if (item.children) {
                await this.createRoutes(item.children, arr, item.path)
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

    logout = () => {
        localStorage.removeItem(http.header)
        this.props.navigate("/login")
    }

    componentDidMount = () => {
        getSysUserInfo().then(user => {
            this.setState({
                userInfo: user
            })
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
                    routers: routers,
                    routes: await this.createRoutes(routers)
                })
            })
        })
    }

    render() {
        return (
            <Layout className='lia_home_container'>
                <Sider collapsed={this.state.collapsed} style={{ overflow: 'auto',paddingTop: 15 }}>
                    <div className='userInfo'>
                        <img src={this.state.userInfo?.headImg} className="headImg" />
                        {
                            this.state.collapsed
                            ? null
                            : <Dropdown
                                trigger={['click']}
                                overlay={
                                    <Menu
                                        items={[
                                            {
                                                key: 'userInfo',
                                                label: '个人资料',
                                                onClick: () => {
                                                    this.props.navigate("/")
                                                }
                                            },
                                            {
                                                type: 'divider',
                                            },
                                            {
                                                key: 'logout',
                                                danger: true,
                                                label: '退出登录',
                                                onClick: this.logout
                                            },
                                        ]}
                                    />
                                }>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        {this.state.userInfo?.nick}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        }
                    </div>
                    {
                        this.state.selectedKeys
                            ? <Menu
                                onClick={this.routerClick}
                                theme="dark"
                                mode="inline"
                                defaultOpenKeys={this.state.selectedKeys.slice(0, this.state.selectedKeys.length - 1)}
                                defaultSelectedKeys={this.state.selectedKeys}
                                items={this.state.routers}
                            />
                            : null
                    }

                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background">
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