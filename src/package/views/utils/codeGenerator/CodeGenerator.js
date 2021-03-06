import React from "react";
import { Table, Input, Space, Button, Switch, Select, message, Modal, Tabs, Form, Col, Row } from 'antd';
import { PlusOutlined, MinusOutlined, CheckOutlined } from '@ant-design/icons';
import './codeGenerator.scss'
import * as codeCreate from './codeCreate.js'

const { Option } = Select;
const { TabPane } = Tabs;

export default class CodeGenerator extends React.Component {

    columns = [
        {
            title: "#",
            dataIndex: '#',
            key: '#',
            render: (text, record, index) => {
                return (
                    <MinusOutlined key="remove" onClick={() => this.removeRow(index)} style={{ color: 'red' }} />
                )
            }
        },
        {
            title: "字段名",
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <Input name="name" value={this.state.data[index].name} onChange={(e) => this.changeValue(e.target.name, e.target.value, index)} />
                )
            }
        },
        {
            title: "数据类型",
            dataIndex: 'type',
            width: 150,
            key: 'type',
            render: (text, record, index) => {
                return (
                    <Select value={this.state.data[index].type} style={{ width: '100%' }} onChange={(value) => this.changeValue("type", value, index)}>
                        <Option key="String" value="String">String</Option>
                        <Option key="Character" value="Character">char</Option>
                        <Option key="Integer" value="Integer">int</Option>
                        <Option key="Long" value="Long">long</Option>
                        <Option key="Float" value="Float">float</Option>
                        <Option key="Double" value="Double">double</Option>
                        <Option key="date" value="date">date</Option>
                        <Option key="datetime" value="datetime">datetime</Option>
                    </Select>
                )
            }
        },
        {
            title: "长度",
            dataIndex: 'len',
            width: 100,
            key: 'len',
            render: (text, record, index) => {
                return (
                    <Input name="len" value={this.state.data[index].len} onChange={(e) => this.changeValue(e.target.name, e.target.value, index)} />
                )
            }
        },
        {
            title: "必填",
            dataIndex: 'notNull',
            key: 'notNull',
            render: (text, record, index) => {
                return (
                    <Switch name="notNull" checked={this.state.data[index].notNull} onChange={(value, e) => this.switchChange(value, e, index)} />
                )
            }
        },
        {
            title: "唯一约束",
            dataIndex: 'unique',
            key: 'unique',
            render: (text, record, index) => {
                return (
                    <Switch name="unique" checked={this.state.data[index].unique} onChange={(value, e) => this.switchChange(value, e, index)} />
                )
            }
        },
        {
            title: "备注",
            dataIndex: 'remark',
            key: 'remark',
            render: (text, record, index) => {
                return (
                    <Input name="remark" value={this.state.data[index].remark} onChange={(e) => this.changeValue(e.target.name, e.target.value, index)} />
                )
            }
        }
    ]

    state = {
        data: []
    }

    switchChange = (value, e, index) => {
        this.changeValue(e.target.name, value, index)
    }


    changeValue = (name, value, index) => {
        if (name === 'len') {
            value = parseInt(value) || 0
        }
        this.state.data[index][name] = value
        this.state.data[index] = { ...this.state.data[index] }
        this.setState({
            data: [...this.state.data]
        })
    }


    /**
     * 新增一行
     */
    addRow = () => {
        this.state.data.push({
            name: '',
            type: 'String',
            len: 0,
            notNull: false,
            unique: false,
            remark: ''
        })
        this.setState({
            data: [...this.state.data]
        })
    }



    removeRow = (index) => {
        this.state.data.splice(index, 1)
        this.setState({
            data: [...this.state.data]
        })
    }


    generator = (data, tableName, primaryKey, httpUrl) => {
        Modal.success({
            width: 800,
            okText: '确定',
            className: 'code-generator-modal',
            destroyOnClose: true,
            title: '生成代码',
            content: (
                <Tabs defaultActiveKey="1">
                    <TabPane tab="entity" key="1">
                        {codeCreate.entityCode(data, tableName, primaryKey)}
                    </TabPane>
                    <TabPane tab="controller" key="2">
                        {codeCreate.controllerCode(data, tableName, httpUrl)}
                    </TabPane>
                    <TabPane tab="service" key="3">
                        {codeCreate.serviceCode(tableName, primaryKey)}
                    </TabPane>
                    <TabPane tab="mapper" key="4">
                        {codeCreate.mapperCode(tableName)}
                    </TabPane>
                    <TabPane tab="mybatis" key="5">
                        {codeCreate.mybatisCode(data, tableName, primaryKey)}
                    </TabPane>
                    <TabPane tab="mysql" key="6">
                        {codeCreate.mysqlCode(tableName,data,primaryKey)}
                    </TabPane>
                </Tabs>
            )
        })
    }


    onFinish = (values) => {
        let { tableName, httpUrl, primaryKeyType } = values
        tableName = tableName.replace(/ /g,'')
        httpUrl = httpUrl?.replace(/ /g,'')
        if (!/^[A-Za-z_]+$/.test(tableName[0]) || !/^[A-Za-z0-9_]+$/.test(tableName)) {
            message.warning("表名不合法")
            return
        }
        if (!this.state.data || this.state.data.length == 0) {
            message.warning("数据为空")
            return
        }
        const data = [...this.state.data]
        for (let i in data) {
            let item = data[i]
            if (!item.name) {
                message.warning("第" + (parseInt(i) + 1) + "条数据字段名为空")
                return
            }
            item.name = item.name.replace(/ /g,'')
            if (!/^[A-Za-z_]+$/.test(item.name[0]) || !/^[A-Za-z0-9_]+$/.test(item.name)) {
                message.warning("字段名" + item.name + "不合法")
                return
            }
            item.name = codeCreate.firstLow(codeCreate.toHump(item.name))
        }
        const primaryKey = {
            name: codeCreate.firstLow(codeCreate.toHump(tableName.replace(/ /g,'')))+"Id",
            type: primaryKeyType
        }
        this.generator(data, tableName, primaryKey, httpUrl)
    }


    /**
     * 生成按钮组
     * @returns 
     */
    createBtns = () => {
        return (
            <Form onFinish={this.onFinish} initialValues={{primaryKeyType: "autoIncrement"}}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="tableName"
                            label="表名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入表名',
                                }
                            ]}
                        >
                            <Input placeholder="请输入表名" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="primaryKeyType"
                            label="主键类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入主键名称',
                                }
                            ]}
                        >
                            <Select>
                                <Option value="autoIncrement">自增</Option>
                                <Option value="snowflake">雪花</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="httpUrl"
                            label="接口地址"
                        >
                            <Input placeholder="请输入接口地址" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Space>
                        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={this.addRow}>添加一行</Button>
                        <Button htmlType="submit" key="generator" type="primary" icon={<CheckOutlined />}>生成代码</Button>
                    </Space>
                </Row>
            </Form>
        )
    }

    render() {
        return (
            <section>
                <Table
                    columns={this.columns}
                    bordered
                    rowKey={record => {
                        return this.state.data.indexOf(record)
                    }}
                    dataSource={this.state.data}
                    title={this.createBtns}
                />
            </section>
        )
    }
}