import React from "react";
import { Table, Input, Space, Button, Switch, Select, message, Modal, Tabs, Form, Col, Row } from 'antd';
import { PlusOutlined, MinusOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { saveSysToolCode } from "@/package/request/system/tool/code"
import HistoryCode from './HistoryCode'
import './codeGenerator.scss'
import * as codeCreate from './codeCreate.js'

const { Option } = Select;

export default class CodeGenerator extends React.Component {

    columns = [
        {
            title: "#",
            dataIndex: '#',
            align: 'center',
            width: 60,
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
            title: "模糊查询",
            dataIndex: 'like',
            key: 'like',
            render: (text, record, index) => {
                return (
                    <Switch name="like" checked={this.state.data[index].like} onChange={(value, e) => this.switchChange(value, e, index)} />
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
        data: [],
        visible: false,
        heads: null,
        codeId: null
    }


    /**
     * 设置当前编辑的记录
     */
    setCodeId = (codeId) => {
        this.setState({codeId})
    }

    /**
     * 查看历史记录
     */
    showModal = (e, record) => {
        e.stopPropagation()
        this.setState({
            visible: true
        })
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
            like: false,
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


    /**
     * 点击复制
     */
    copy = (e) => {
        navigator.clipboard.writeText(e.target.innerText)
        message.success("复制成功")
    }


    generator = (params) => {
        const record = {
            codeId: this.state.codeId,
            columns: JSON.stringify(params.data),
            tableName: params.tableName,
            module: params.module,
            primaryKey: JSON.stringify(params.primaryKey),
            httpUrl: params.httpUrl,
            CreaterFlag: params.CreaterFlag ? "1" : "0",
            createTimeFlag: params.createTimeFlag ? "1" : "0",
            updateTimeFlag: params.updateTimeFlag ? "1" : "0",
            remarkFlag: params.remarkFlag ? "1" : "0"
        }
        // 将表格信息存入历史记录
        saveSysToolCode(record)
        const tabItems = [
            {
                label: "request",
                key: "request",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.requestCode(params)}
                    </div>
                )
            },
            {
                label: "view",
                key: "view",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.viewCode(params)}
                    </div>
                )
            },
            {
                label: "entity",
                key: "entity",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.entityCode(params)}
                    </div>
                )
            },
            {
                label: "controller",
                key: "controller",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.controllerCode(params)}
                    </div>
                )
            },
            {
                label: "service",
                key: "service",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.serviceCode(params)}
                    </div>
                )
            },
            {
                label: "mapper",
                key: "mapper",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.mapperCode(params)}
                    </div>
                )
            },
            {
                label: "mybatis",
                key: "mybatis",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.mybatisCode(params)}
                    </div>
                )
            },
            {
                label: "mysql",
                key: "mysql",
                children: (
                    <div onClick={this.copy}>
                        {codeCreate.mysqlCode(params)}
                    </div>
                )
            }
        ]
        Modal.success({
            width: 1000,
            okText: '确定',
            centered: true,
            maskClosable: true,
            className: 'code-generator-modal',
            destroyOnClose: true,
            title: '生成代码',
            content: (
                <Tabs defaultActiveKey="request" items={tabItems} />
            )
        })
    }


    onFinish = (values) => {
        let { module, tableName, httpUrl, primaryKeyType, CreaterFlag, createTimeFlag, updateTimeFlag, remarkFlag } = values
        // 去除空格
        tableName = tableName.replace(/ /g, '')
        httpUrl = httpUrl?.replace(/ /g, '')
        module = module?.replace(/ /g, '')
        // 判断表名称是否合法
        if (!/^[A-Za-z_]+$/.test(tableName[0]) || !/^[A-Za-z0-9_]+$/.test(tableName)) {
            message.warning("表名不合法")
            return
        }
        // 判断包路径是否合法
        for (const item of module?.split(".")) {
            if (!/^[A-Za-z_]+$/.test(item[0]) || !/^[A-Za-z0-9_]+$/.test(item)) {
                message.warning("包路径不合法")
                return
            }
        }
        // 表格最少要有一条数据（一个字段）
        if (!this.state.data || this.state.data.length == 0) {
            message.warning("数据为空")
            return
        }
        const data = [...this.state.data]
        for (let i in data) {
            let item = data[i]
            // 字段名不可为空
            if (!item.name) {
                message.warning("第" + (parseInt(i) + 1) + "条数据字段名为空")
                return
            }
            // 去除字段名中的空格
            item.name = item.name.replace(/ /g, '')
            // 判断字段名是否合法
            if (!/^[A-Za-z_]+$/.test(item.name[0]) || !/^[A-Za-z0-9_]+$/.test(item.name)) {
                message.warning("字段名" + item.name + "不合法")
                return
            }
            // 字段名转驼峰
            item.name = codeCreate.firstLow(codeCreate.toHump(item.name))
        }
        // 生成主键信息
        const primaryKey = {
            name: "id",
            type: primaryKeyType
        }
        const params = {
            module,
            data, 
            tableName, 
            primaryKey, 
            httpUrl, 
            CreaterFlag, 
            createTimeFlag,
            updateTimeFlag, 
            remarkFlag
        }
        this.generator(params)
    }


    defaultFormValues = {
        primaryKeyType: "autoIncrement",
        CreaterFlag: true,
        createTimeFlag: true,
        updateTimeFlag: true,
        remarkFlag: true
    }


    /**
     * 生成按钮组
     * @returns 
     */
    createBtns = () => {
        return (
            <Form onFinish={this.onFinish} initialValues={this.defaultFormValues} fields={this.state.heads}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            name="module"
                            label="包路径"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入包路径',
                                }
                            ]}
                        >
                            <Input placeholder="请输入包路径" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
                        <Form.Item
                            name="httpUrl"
                            label="接口地址"
                        >
                            <Input placeholder="请输入接口地址" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                    <Col span={3}>
                        <Form.Item
                            valuePropName="checked"
                            name="CreaterFlag"
                            label="创建人"
                        >
                            <Switch defaultChecked />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            valuePropName="checked"
                            name="createTimeFlag"
                            label="创建时间"
                        >
                            <Switch defaultChecked />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            valuePropName="checked"
                            name="updateTimeFlag"
                            label="更新时间"
                        >
                            <Switch defaultChecked />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            valuePropName="checked"
                            name="remarkFlag"
                            label="备注"
                        >
                            <Switch defaultChecked />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Space>
                        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={this.addRow}>添加一行</Button>
                        <Button htmlType="submit" key="generator" type="primary" icon={<CheckOutlined />}>生成代码</Button>
                        <Button key="history" type="primary" icon={<ClockCircleOutlined />} onClick={this.showModal}>历史记录</Button>
                    </Space>
                </Row>
            </Form>
        )
    }

    render() {
        return (
            <section style={{padding: 24}}>
                <Table
                    columns={this.columns}
                    bordered
                    rowKey={record => {
                        return this.state.data.indexOf(record)
                    }}
                    dataSource={this.state.data}
                    title={this.createBtns}
                />
                <Modal
                    centered
                    width={1200}
                    className="code-generator-modal"
                    destroyOnClose
                    keyboard
                    title="历史记录"
                    open={this.state.visible}
                    footer={null}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <HistoryCode
                        close={() => this.setState({ visible: false })}
                        setData={(data) => this.setState({ data: data })}
                        setHeads={(heads) => this.setState({ heads: heads })}
                        setCodeId={this.setCodeId}
                    />
                </Modal>
            </section>
        )
    }
}