import React from 'react';
import { Button, Form, Input, Divider, Row, Col, message } from 'antd';
import CrudConfirm from '@/package/components/crud/CrudConfirm.js'
import { saveSysDict, deleteDictsByType, updateDictType } from '@/package/request/system/dict'

const { TextArea } = Input;


const DictForm = ({ formValue = {}, reloadMenu, setVisible }) => {
    const defaultValue = formValue
    formValue = Object.keys(formValue).map(key => {
        return {
            name: [key],
            value: formValue[key]
        }
    })
    const [form] = Form.useForm();

    function submit() {
        form.validateFields().then(dict => {
            if (defaultValue.type) {
                updateDictType(dict, defaultValue.type, defaultValue.name).then(res => {
                    if (res === 'success') {
                        message.success("保存成功")
                        setVisible(false)
                        reloadMenu()
                    } 
                    else if(res === 'error'){
                        message.error("未知错误")
                    }
                    else {
                        message.warning(res)
                    }
                })
            }else{
                saveSysDict(dict).then(res => {
                    if (res === 'success') {
                        message.success("保存成功")
                        setVisible(false)
                        reloadMenu()
                    } 
                    else if(res === 'error'){
                        message.error("未知错误")
                    }
                    else {
                        message.warning(res)
                    }
                })
            }
        })
    }

    function deleteDict() {
        deleteDictsByType(defaultValue.type).then(res => {
            if (parseInt(res) > 0) {
                message.success("删除成功")
                setVisible(false)
                reloadMenu()
            } else {
                message.warning("删除失败")
            }
        })
    }

    return (
        <div className='system-dict-form'>
            <Form
                form={form}
                fields={formValue}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="类别"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入类别',
                                }
                            ]}
                        >
                            <Input placeholder="请输入类别" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="类别名"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入类别名',
                                }
                            ]}
                        >
                            <Input placeholder="请输入类别名" allowClear />
                        </Form.Item>
                    </Col>
                </Row>
                {
                    defaultValue.type ? null : (
                        <Row gutter={24}>
                            <Divider plain style={{marginTop: 0}}>第一条数据</Divider>
                            <Col span={12}>
                                <Form.Item
                                    name="label"
                                    label="字典值"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入字典值',
                                        }
                                    ]}
                                >
                                    <Input placeholder="请输入字典值" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="value"
                                    label="字典key"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入字典key',
                                        }
                                    ]}
                                >
                                    <Input placeholder="请输入字典key" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="remark"
                                    label="备注"
                                >
                                    <TextArea placeholder="请输入备注" allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                }
            </Form>
            <div className='btns'>
                {
                    defaultValue.type ? <CrudConfirm deleteSubmit={deleteDict} size="default" /> : null
                }
                <Button type="primary" onClick={submit}>保存</Button>
            </div>
        </div>
    );
};

export default DictForm;