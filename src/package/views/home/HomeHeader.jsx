import Message from './message/Message'
import { Layout, Breadcrumb, Button, Tooltip, Space } from 'antd';
import * as icons from '@ant-design/icons'
import React from 'react';
import { logout } from '@/package/request/system/user'
import withRouter from '@/package/components/hoc/WithRouter';
import { login, changeMenus } from '@/package/store/loginUserSlice';
import withRedux from '@/package/components/hoc/WithRedux';

const { Header } = Layout

function HomeHeader(props) {

    /**
     * 退出登录
     */
    function logoutClick() {
        logout().then(() => {
            localStorage.removeItem(process.env.REACT_APP_HTTP_HEADER)
            props.navigate("/login")
            props.dispatch(login(null))
            props.dispatch(changeMenus(null))
        })
    }

    function openGitHub() {
        window.open(process.env.REACT_APP_GITHUB_NEST_URL)
        window.open(process.env.REACT_APP_GITHUB_APP_URL)
    }

    function openDocs() {
        window.open(process.env.REACT_APP_DOCS_URL)
    }


    return (
        <Header className="site-layout-background">
            {React.createElement(props.collapsed ? icons.MenuUnfoldOutlined : icons.MenuFoldOutlined, {
                className: 'trigger',
                onClick: props.toggle,
            })}
            <Breadcrumb style={{ margin: '16px 0', display: 'inline-block' }}>
                {props.routePath}
            </Breadcrumb>
            <div className='action'>
                <Space size={"middle"}>
                    <Tooltip title="源码地址">
                        <icons.GithubOutlined className='icon' onClick={openGitHub} />
                    </Tooltip>
                    <Tooltip title="开发文档">
                        <icons.QuestionCircleOutlined className='icon' onClick={openDocs} />
                    </Tooltip>
                    <Message userInfo={props.userInfo} />
                    <Tooltip title="退出登录">
                        <Button size='large' danger type="primary" shape="circle" icon={<icons.LogoutOutlined />} onClick={logoutClick} />
                    </Tooltip>
                </Space>
            </div>
        </Header>
    )
}


export default withRedux(withRouter(HomeHeader))