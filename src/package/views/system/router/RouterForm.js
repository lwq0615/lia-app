import React from 'react';
import { Button, Form, Input, InputNumber, Row, Col, TreeSelect, Select, message, Divider } from 'antd';
import CrudConfirm from '@/package/components/crud/CrudConfirm.js'
import { saveSysRouter, deleteRouters } from '@/package/request/system/router'
import Icons from '@/package/components/crud/Icons.js'

const { Option } = Select;
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

/**
     * 生成Select组件的Option
     * @param {*} dict 
     * @returns 
     */
function createOptions(dict) {
    return dict.map(item => {
        return (
            <Option value={parseInt(item.value)} key={item.value}>{item.label}</Option>
        )
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

const RouterForm = ({ routerDict, formValue, userDict, formTitle, routerId, reloadTree, setForm }) => {
    const [form] = Form.useForm();

    function submit() {
        form.validateFields().then(router => {
            if (routerId) {
                router.routerId = routerId
            }
            saveSysRouter(router).then(res => {
                if (res === 'success') {
                    message.success("保存成功")
                    setForm()
                    reloadTree()
                } 
                else if(res === 'error'){
                    message.error("未知错误")
                }
                else {
                    message.warning(res)
                }
            })
        })
    }

    function deleteRouter(){
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
                    {
                        routerId ? <Col span={12}>
                            <Form.Item name="createBy" label="创建人">
                                <Select
                                    allowClear
                                    placeholder="请选择创建人"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {userDict ? createOptions(userDict) : null}
                                </Select>
                            </Form.Item>
                        </Col> : null
                    }
                    <Col span={12}>
                        <Form.Item name="index" label="排序">
                            <InputNumber style={{ width: '100%' }} placeholder="请选择排序" />
                        </Form.Item>
                    </Col>
                    {
                        routerId ? <Col span={12}>
                            <Form.Item name="createTime" label="创建时间">
                                <Input
                                    style={{ width: '100%' }}
                                    type='datetime-local'
                                    picker='date'
                                    placeholder="请选择时间"
                                    allowClear
                                />
                            </Form.Item>
                        </Col> : null
                    }
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
                    routerId ? <CrudConfirm msg="子路由和该路由下的权限也会被清空，确认删除？" deleteSubmit={deleteRouter} size="default"/> : null
                }
            </div>
        </div>
    );
};

export default RouterForm;