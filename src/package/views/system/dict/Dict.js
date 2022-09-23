import Crud from '@/package/components/crud/Crud'
import { getSysDictTypePage, saveSysDictType, deleteSysDictTypes } from '@/package/request/system/dictType'
import { message, Button, Modal } from "antd"
import DictData from './DictData'
import { getCreateByDict } from '@/package/request/system/user'
import React from 'react'


export default class SysDictType extends React.Component {

    showModal = (e, record) => {
        e.stopPropagation()
        this.setState({
            typeName: record.name,
            typeId: record.typeId,
            visible: true
        })
    }

    constructor(props){
        super(props)
        this.state = {
            option: {
                // 是否显示行索引，默认true
                showIndex: true,
                // 是否展示右侧操作栏，默认["edit", "delete"]
                rightAction: ["edit", (record) => {
                    return (<Button key="roleSet" type="primary" size='small' onClick={(e) => { this.showModal(e, record) }}>配置</Button>)
                }, "delete"],
                // 配置按钮组，默认["add", "delete", "search"]
                menuBtns: true,
                // 表格行是否可选择(默认false)
                selection: true,
                // 触发删除钩子 records => {}
                //return true刷新页面数据
                onDelete: async records => {
                    return await deleteSysDictTypes(records.map(item => item.typeId)).then(res => {
                        if (res > 0) {
                            message.success("删除成功")
                            return true
                        } else {
                            message.error("删除失败")
                            return false
                        }
                    })
                },
                // 需要加载数据时触发 params => {}
                getPage: (params, page) => {
                    params.createTime = params.createTime?.join(",")
                    return getSysDictTypePage(params, page.current, page.size)
                },
                // 新增编辑提交钩子 async (form, type) => {}
                // 如果需要获取返回值再关闭弹窗，请使用await
                // return true刷新页面
                onSave: async (form, type) => {
                    return await saveSysDictType(form).then(res => {
                        if (res === 'error') {
                            message.warning("未知错误")
                            return false
                        } else if (res === 'success') {
                            message.success(type + "成功")
                            return true
                        } else {
                            message.warning(res)
                            return false
                        }
                    })
                },
                columns: [
                    {
                        title: '类别名',
                        dataIndex: 'name',
                        align: 'center',
                        key: 'name',
                        required: true
                    },
                    {
                        title: '标识符',
                        dataIndex: 'key',
                        align: 'center',
                        key: 'key',
                        required: true
                    },
                    {
                        title: '创建人',
                        dataIndex: 'createBy',
                        align: 'center',
                        key: 'createBy',
                        addShow: false,
                        editShow: false,
                        type: "select",
                        dict: getCreateByDict
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        align: 'center',
                        key: 'createTime',
                        addShow: false,
                        editShow: false,
                        type: 'datetime',
                        // 开启范围搜索,只在type为date或datetiime时生效(默认false)
                        range: true,
                        //该列在搜索框所占宽度，最大24,默认6
                        span: 8
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        align: 'center',
                        key: 'remark',
                        hideText: true,
                        required: false
                    }
                ]
            },
            visible: false,
            typeName: null,
            typeId: null
        }
    }

    render() {
        return <>
            <Crud {...this.state.option} />
            <Modal
                centered
                width={1200}
                destroyOnClose
                keyboard
                title={this.state.typeName}
                visible={this.state.visible}
                footer={null}
                onCancel={() => this.setState({ visible: false })}
            >
                {
                    this.state.typeId && <DictData typeId={this.state.typeId} />
                }
            </Modal>
        </>
    }
}          