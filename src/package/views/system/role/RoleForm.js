import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, DatePicker, TreeSelect } from 'antd';
import CrudMultipleTree from '@/package/components/crud/CrudMultipleTree';
import { getRoleOfCompanyDict } from '@/package/request/system/role'
import { getCompanyDict } from '@/package/request/system/company'
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

/**
* 生成Select组件的Option
* @param {*} dict 
* @returns 
*/
const createOptions = (dict) => {
    if (!Array.isArray(dict)) {
        return
    }
    return dict.map(item => {
        return (
            <Option value={item.value} key={item.value}>{item.label}</Option>
        )
    })
}


export default function RoleForm(props) {

    const [companyDict, setCompanyDict] = useState([])
    const [roleOfCompanyDict, setRoleOfCompanyDict] = useState(null)
    const [routerTree, setRouterTree] = useState([])
    const [authTree, setAuthTree] = useState([])

    useEffect(() => {
        // 先将日期格式转换为moment
        if (props.formDefaultValues?.createTime) {
            props.formDefaultValues.createTime = moment(props.formDefaultValues.createTime).format("YYYY-MM-DDTHH:mm")
        }
        getCompanyDict().then(res => {
            //select组件的onchange无法监听初始值变化，编辑时需要手动给上级select进行配置
            if(props.formDefaultValues?.companyId){
                companyChange(props.formDefaultValues.companyId)

            }
            setCompanyDict(res)
        })
        props.getRouterTree().then(res => {
            setRouterTree(res)
        })
        props.getAuthTree().then(res => {
            setAuthTree(res)
        })
    }, [])

    function companyChange(value) {
        if(!value){
            return
        }
        getRoleOfCompanyDict(value).then(res => {
            setRoleOfCompanyDict(res)
        })
    }

    return (
        <Form
            ref={ref => props.setRef(ref)}
            initialValues={props.formDefaultValues || {}}
            className="ant-advanced-search-form crud-form"
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="角色名称"
                        name="name"
                        required
                    >
                        <Input
                            placeholder={"请输入角色名称"}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="标识符"
                        name="key"
                        required
                    >
                        <Input
                            placeholder={"请输入标识符"}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="所属企业"
                        name="companyId"
                        required
                    >
                        <Select
                            allowClear
                            placeholder={"请选择所属企业"}
                            showSearch
                            onChange={companyChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {createOptions(companyDict)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="上级"
                        name="superior"
                    >
                        <Select
                            allowClear
                            placeholder={"请选择上级"}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {createOptions(roleOfCompanyDict)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="跟路由"
                        name="rootRouterId"
                        required
                    >
                        <TreeSelect
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            allowClear
                            treeData={routerTree}
                            placeholder="请选择跟路由"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="权限"
                        name="auths"
                    >
                        <CrudMultipleTree values={props.formDefaultValues?.auths} treeData={authTree} column={{ title: "权限" }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="路由"
                        name="routers"
                    >
                        <CrudMultipleTree values={props.formDefaultValues?.routers} treeData={routerTree[0]?.children} column={{ title: "路由" }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="备注"
                        name="remark"
                    >
                        <TextArea
                            allowClear
                            placeholder="请输入备注"
                            rows={4}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}