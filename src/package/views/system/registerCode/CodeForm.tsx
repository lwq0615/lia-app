import React, { useEffect, useState } from 'react';
import { Form, InputNumber, TreeSelect, Row, Col, Button, message, Radio } from 'antd';
import { getRoleDict } from '@/package/request/system/role'
import { create } from '@/package/request/system/registerCode'
import excel from '@/package/utils/excel'
import withRedux from '@/package/components/hoc/WithRedux';

interface DictData {
    dataId: number,
    value: any,
    label: string,
    typeId: number,
    creater: number,
    createTime: string,
    remark: string
}

interface TreeDataItem {
    title: string,
    value: any,
    selectable: boolean,
    children: TreeDataItem[]
}

interface CodeData {
    id: number,
    code: string,
    creater: number,
    createTime: string,
    roleId: number,
    useBy: number | null,
    useTime: number | null,
    [key: string]: any

}

const CodeForm: React.FC = (props: any) => {

    const [roleId, setRoleId] = useState<number | null>(null)
    const [roleDict, setRoleDict] = useState<DictData[]>([])
    const [treeData, setTreeData] = useState<TreeDataItem[]>([])
    const [codeData, setCodeData] = useState<CodeData[]>([])

    /**
     * 点击生成
     */
    const onFinish = (values: any) => {
        if(values.expireTime){
            values.expireTime = values.expireTime * values.unit * 60 * 1000
        }
        create(values.roleId, values.count, values.expireTime).then((res) => {
            if (Array.isArray(res) && res.length) {
                showCode(res)
                props.crudRef.refreshPage()
                message.success("生成成功")
            } else {
                message.warn("生成失败")
            }
        })
    };

    /**
     * 展示生成的注册码
     */
    const showCode = (codeDatas: CodeData[]) => {
        setCodeData(codeDatas)
    }

    /**
     * 导出excel
     */
    function excelData(data: CodeData[]) {
        const role: any = roleDict.find((item: any) => {
            return item.value = roleId
        })
        data.forEach(item => {
            item.roleName = role.label
            item.companyName = role.remark
            item.CreaterName = props.getReduxState("loginUser.userInfo")?.nick
        })
        const heads = {
            code: '注册码',
            roleName: '可激活角色',
            companyName: '所属企业',
            CreaterName: '创建人',
            createTime: '创建时间'
        }
        excel(heads, data, role.remark + role.label + '注册码')
    }

    useEffect(() => {
        const roleTreeDict: TreeDataItem[] = []
        getRoleDict().then(res => {
            setRoleDict(res)
            const companyRoleTree: any = {}
            res.forEach((item: DictData) => {
                // 普通用户不需要注册码
                if (item.value === 3) {
                    return
                }
                if (!Array.isArray(companyRoleTree[item.remark])) {
                    companyRoleTree[item.remark] = []
                }
                companyRoleTree[item.remark].push(item)
            })
            Object.keys(companyRoleTree).forEach(item => {
                roleTreeDict.push({
                    title: item,
                    value: Symbol(item).toString(),
                    selectable: false,
                    children: companyRoleTree[item]
                })
            })
            setTreeData(roleTreeDict)
        })
    }, [])

    return codeData.length > 0
        ? (
            <div style={{ textAlign: 'right' }}>
                <Row gutter={[0, 24]} style={{ maxHeight: 400, overflow: 'auto', textAlign: 'center', fontSize: 15 }}>
                    {codeData.map((item: CodeData) => {
                        return (
                            <Col span={8} key={item.id}>{item.code}</Col>
                        )
                    })}
                </Row>
                <Button type="primary" style={{ marginTop: 20 }} onClick={() => excelData(codeData)}>
                    导出excel
                </Button>
            </div>
        )
        : (
            <Form
                name="basic"
                initialValues={{ unit: 1 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="角色"
                            name="roleId"
                            rules={[{ required: true, message: '请选择可激活的角色' }]}
                        >
                            <TreeSelect
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                }}
                                allowClear
                                treeData={treeData}
                                onChange={(value) => {
                                    setRoleId(value)
                                }}
                                placeholder={"请选择要激活的角色"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="数量"
                            name="count"
                            rules={[{
                                required: true,
                                type: 'number',
                                min: 1
                            }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder={"请输入要生成的数量"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="有效期"
                            name="expireTime"
                            rules={[{
                                type: 'number',
                                min: 1
                            }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder={"注册码有效期"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label=""
                            name="unit"
                        >
                            <Radio.Group>
                                <Radio.Button value={1440}>天</Radio.Button>
                                <Radio.Button value={60}>小时</Radio.Button>
                                <Radio.Button value={1}>分钟</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                            生成
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
};

export default withRedux(CodeForm);