
import React from "react"
import '@/package/css/login.scss'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { http } from "@/config"
import WithRouter from '@/package/components/hoc/WithRouter';
import { sysUserLogin } from '@/package/request/system/user.js'

class Login extends React.Component {

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
                    this.props.navigate("/home")
                }
            }
        })
    };

    render() {
        return (
            <section className="lia_login_container">
                <div className="login_box">
                    <div className="login_img"></div>
                    <Form
                        name="normal_login"
                        className="login-form login_form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
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
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                                忘记密码
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        )
    }
}

export default WithRouter(Login)