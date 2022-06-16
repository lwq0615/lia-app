
import React from "react"
import './login.scss'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { http } from "@/config"
import WithRouter from '@/package/components/hoc/WithRouter';
import { sysUserLogin } from '@/package/request/system/user.js'

class Login extends React.Component {

    constructor(props){
        super(props)
        let form = {}
        if(localStorage.getItem("username") && localStorage.getItem("password")){
            form = {
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password")
            }
        }
        this.state = {
            rememberMe: true,
            form: form
        }
    }

    /**
     * 提交登录验证表单
     * @param {Object} values 
     */
    onFinish = async (values) => {
        sysUserLogin(values).then(res => {
            switch (res) {
                case "login failed": {
                    message.warning("用户名或密码错误")
                    break
                }
                case "less param": {
                    message.warning("请填写完整")
                    break
                }
                default: {
                    localStorage.setItem(http.header, res)
                    if(this.state.rememberMe){
                        localStorage.setItem("username", values.username)
                        localStorage.setItem("password", values.password)
                    }else{
                        localStorage.removeItem("username")
                        localStorage.removeItem("password")
                    }
                    this.props.navigate("/")
                }
            }
        })
    };

    rememberMeChange = (e) => {
        this.setState({
            rememberMe: e.target.checked
        })
    }

    render() {
        return (
            <section className="lia_login_container">
                <div className="login_box">
                    <div className="login_img"></div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={this.state.form}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="用户名" 
                                value={this.state.username}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                                value={this.state.password}
                            />
                        </Form.Item>
                        <div style={{padding: '10px 0 20px 0'}}>
                            <Checkbox onChange={this.rememberMeChange} checked={this.state.rememberMe}>记住我</Checkbox>
                            <a className="login-form-forgot" href="#">
                                忘记密码
                            </a>
                        </div>

                        <Form.Item style={{margin: 0}}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            <Button type="primary" className="login-form-button" onClick={() => this.onFinish({
                                username: 'visitor',
                                password: '123456'
                            })}>
                                游客登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        )
    }
}

export default WithRouter(Login)