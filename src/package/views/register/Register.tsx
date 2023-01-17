import React, { useState, useEffect } from "react";
import './register.scss'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, FieldStringOutlined, FieldNumberOutlined } from '@ant-design/icons'
import WithRouter from '@/package/components/hoc/WithRouter';
import { getParamValue } from '@/package/request/system/param'
import CheckCode from "@/package/components/checkCode/CheckCode"
import { registerUser } from '@/package/request/system/user'

const Register: React.FC = function (props: any) {

    const [registerCheckCode, setRegisterCheckCode] = useState<boolean>(true)
    const [codeRef, setCodeRef] = useState<CheckCode | null>(null)

    useEffect(() => {
        // 判断是否开启验证码
        getParamValue("register_check_code").then((res: any) => {
            if (res.code === 200) {
                setRegisterCheckCode(res.data === 'true')
            } else {
                message.warning(res.message)
            }
        })
    }, [])

    const onFinish = (values: { nick: string, username: string, password: string, registerCode: string }) => {
        registerUser(values, values.registerCode).then((res: any) => {
            if (res.code === 200) {
                message.success("注册成功")
                props.navigate("/login")
            } else {
                message.warning(res.message)
            }
        })
    }

    return (
        <section className="lia_register_container">
            <div className="register_box">
                <div className="register_img"></div>
                <div>
                    <h2 style={{ textAlign: 'center', margin: 0 }}>注&nbsp;册</h2>
                    <Form
                        name="normal_register"
                        className="register-form"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="nick"
                            rules={[{ required: true, message: '请输入昵称' }]}
                        >
                            <Input
                                prefix={<FieldNumberOutlined className="site-form-item-icon" />}
                                placeholder="昵称"
                            />
                        </Form.Item>
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
                        <Form.Item name="registerCode">
                            <Input
                                prefix={<FieldStringOutlined className="site-form-item-icon" />}
                                placeholder="注册码（选填）"
                            />
                        </Form.Item>

                        {
                            registerCheckCode &&
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
                                <CheckCode ref={ref => setCodeRef(ref)} style={{ marginLeft: "5px", height: 32 }} />
                            </div>
                        }

                        <Form.Item style={{ margin: 0 }}>
                            <Button type="primary" htmlType="submit" className="register-form-button">
                                注册
                            </Button>
                            <Button type="primary" onClick={() => props.navigate("/login")} className="register-form-button">
                                去登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </section>
    )
}

export default WithRouter(Register)