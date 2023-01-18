import React from 'react';
import { Button, Form, Input, InputNumber, Row, Col, TreeSelect, message, Divider } from 'antd';
import Confirm from '@/package/components/confirm/Confirm.jsx'
import { saveSysRouter, deleteRouters } from '@/package/request/system/router'
import Icons from '@/package/components/crud/Icons.jsx'

const { TextArea } = Input;


/**
     * 将字典中的label换为title
     * @param {*} treeData 
     */
function treeDataMap(treeData) {
    if (!treeData) {
        return null
    }
    return treeData.map(item => {
        return {
            title: item.label,
            value: item.routerId,
            children: treeDataMap(item.children)
        }
    })
}

function findFormValue(name, values) {
    if (values) {
        for (let item of values) {
            if (item.name[0] === name) {
                return item.value
            }
        }
    }
}

const RouterForm = ({ routerDict, formValue, formTitle, routerId, reloadTree, setForm }) => {
    const [form] = Form.useForm();

    function submit() {
        form.validateFields().then(router => {
            if (routerId) {
                router.routerId = routerId
            }
            saveSysRouter(router).then(res => {
                if(res.code === 200){
                    message.success("保存成功")
                    return true
                }else{
                    message.warning(res.message)
                    return false
                }
            })
        })
    }

    function deleteRouter() {
        deleteRouters([routerId]).then(res => {
            if (res > 0) {
                message.success("删除成功")
                reloadTree()
                setForm()
            } else {
                message.warning("删除失败")
            }
        })
    }

    return (
        <div className='system-router-form'>
            <p className='formTitle'>{formTitle}</p>
            <Form
                form={form}
                fields={formValue}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="label"
                            label="路由名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入路由名称',
                                }
                            ]}
                        >
                            <Input placeholder="请输入路由名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="path"
                            label="路由地址"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入路由地址',
                                }
                            ]}
                        >
                            <Input placeholder="请输入路由地址" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="element" label="组件地址">
                            <Input placeholder="请输入路由地址" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="parent" label="父路由">
                            <TreeSelect
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                }}
                                treeData={treeDataMap(routerDict)}
                                placeholder={"请选择父路由"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="index" label="排序">
                            <InputNumber style={{ width: '100%' }} placeholder="请选择排序" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="icon" label="图标">
                            <Icons value={findFormValue('icon', formValue)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="remark" label="备注">
                            <TextArea
                                allowClear
                                placeholder="请输入备注"
                                rows={4}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Divider plain className='router-divider'>如果路由作为其他路由的父路由，则该路由会成为一个目录，无法进行页面跳转</Divider>
            <div className='btns'>
                <Button type="primary" onClick={submit}>保存</Button>
                {
                    routerId ? <Confirm msg="子路由和该路由下的权限也会被清空，确认删除？" deleteSubmit={deleteRouter} size="default" /> : null
                }
            </div>
        </div>
    );
};

export default RouterForm;