
import React from "react"
import './login.scss'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import WithRouter from '@/package/components/hoc/WithRouter';
import { sysUserLogin } from '@/package/request/system/user.js'
import { getParamValue } from '@/package/request/system/param'
import CheckCode from "@/package/components/checkCode/CheckCode"

class Login extends React.Component {

    constructor(props) {
        super(props)
        let form = {}
        if (localStorage.getItem("username") && localStorage.getItem("password")) {
            form = {
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password")
            }
        }
        this.state = {
            // 记住密码
            rememberMe: true,
            form: form,
            // 开启注册
            enableRegister: false,
            // 登录是否需要验证码
            loginCheckCode: false
        }
    }

    componentDidMount = () => {
        // 判断是否开启注册功能
        getParamValue("enable_register").then(res => {
            this.setState({
                enableRegister: res === 'true'
            })
        })
        // 判断是否开启验证码
        getParamValue("login_check_code").then(res => {
            this.setState({
                loginCheckCode: res === 'true'
            })
        })
    }

    /**
     * 提交登录验证表单
     * @param {Object} values 
     */
    onFinish = async (values) => {
        if (this.state.loginCheckCode && !this.codeRef?.checkCode(values.code)) {
            message.warning("验证码错误")
            return
        }
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
                case "user deactivate": {
                    message.warning("账号已停用")
                    break
                }
                default: {
                    localStorage.setItem(process.env.REACT_APP_HTTP_HEADER, res)
                    if (this.state.rememberMe) {
                        localStorage.setItem("username", values.username)
                        localStorage.setItem("password", values.password)
                    } else {
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

    register = () => {
        this.props.navigate("/register")
    }

    render() {
        return (
            <section className="lia_login_container">
                <div className="login_box">
                    <div className="login_img"></div>
                    <div>
                        <h2 style={{ textAlign: 'center', margin: 0 }}>登&nbsp;录</h2>
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
                                />
                            </Form.Item>

                            {
                                this.state.loginCheckCode &&
                                <div style={{ display: "flex" }}>
                                    <Form.Item
                                        style={{ flex: 1 }}
                                        name="code"
                                        rules={[{ required: true, message: '请输入验证码' }]}
                                    >
                                        <Input
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="text"
                                            placeholder="验证码"
                                        />
                                    </Form.Item>
                                    <CheckCode ref={ref => this.codeRef = ref} style={{ marginLeft: "5px", height: 32 }} />
                                </div>
                            }

                            <div style={{ padding: '10px 0 20px 0' }}>
                                <Checkbox onChange={this.rememberMeChange} checked={this.state.rememberMe}>记住我</Checkbox>
                                <a className="login-form-forgot" href="#">
                                    忘记密码
                                </a>
                            </div>

                            <Form.Item style={{ margin: 0 }}>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                                {
                                    this.state.enableRegister &&
                                    <Button type="primary" className="login-form-button" onClick={this.register}>
                                        去注册
                                    </Button>
                                }
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </section>
        )
    }
}

export default WithRouter(Login)