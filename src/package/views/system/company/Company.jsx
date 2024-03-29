import Crud from '@/package/components/crud/Crud'
import { getSysCompanyPage, saveSysCompany, deleteCompanys } from '@/package/request/system/company'
import { message, Button, Modal } from "antd"
import { getCreaterDict } from '@/package/request/system/user'
import Role from './Role'
import React from 'react'
import './company.scss'
import { DownloadOutlined } from '@ant-design/icons';
import { excelServer } from "@/package/utils/excel"

export default class Company extends React.Component {

    showModal = (e, record) => {
        e.stopPropagation()
        this.setState({
            companyName: record.name,
            companyId: record.companyId,
            visible: true
        })
    }

    state = {
        option: {
            // 是否显示行索引，默认true
            showIndex: true,
            // 是否展示右侧操作栏，默认false
            rightAction: ["edit", (record) => {
                return (<Button key="roleSet" type="primary" size='small' onClick={(e) => { this.showModal(e, record) }}>角色</Button>)
            }, "delete"],
            menuBtns: ["add", "delete", "search", () => {
                const exportExcel = async () => {
                    excelServer({
                        url: "/system/company/excel",
                        method: 'post',
                        data: this.params
                    })
                }
                return (
                    <Button key="excel" type="primary" icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
                )
            }],
            // 表格行是否可选择(默认false)
            selection: true,
            // 删除按钮提示信息
            deleteMsg: "企业下的角色都将被删除，确认删除？",
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await deleteCompanys(records.map(item => item.companyId)).then(res => {
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
            getPage: (params = {}, page = {}) => {
                params.createTime = params.createTime?.join(",")
                this.params = params
                return getSysCompanyPage(params, page.current, page.size)
            },
            // 新增编辑提交钩子 async (form, type) => {}
            // 如果需要获取返回值再关闭弹窗，请使用await
            // return true刷新页面
            onSave: async (form, type) => {
                return await saveSysCompany(form).then(res => {
                    message.success(type + "成功")
                    return true
                })
            },
            columns: [
                {
                    title: '企业名称',
                    dataIndex: 'name',
                    align: 'center',
                    key: 'name',
                    required: true,
                    // 不允许编辑该列的值
                    // editEnable: false
                },
                {
                    title: '负责人',
                    dataIndex: 'principal',
                    align: 'center',
                    key: 'principal',
                    required: true
                },
                {
                    title: '联系方式',
                    dataIndex: 'phone',
                    align: 'center',
                    key: 'phone',
                    required: true
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                    align: 'center',
                    key: 'address'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    align: 'center',
                    key: 'email'
                },
                {
                    title: '创建人',
                    dataIndex: 'creater',
                    align: 'center',
                    key: 'creater',
                    addShow: false,
                    editShow: false,
                    type: "select",
                    dict: getCreaterDict
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
                    type: "textarea",
                    // 是否隐藏文本，通过点击按钮展开（默认false）
                    hideText: true
                }
            ]
        },
        visible: false,
        companyName: null,
        companyId: null
    }

    params = {}

    render() {
        return (
            <>
                <Crud {...this.state.option} style={{padding: 24}} />
                <Modal
                    centered
                    width={1200}
                    destroyOnClose
                    keyboard
                    title={this.state.companyName}
                    open={this.state.visible}
                    footer={null}
                    onCancel={() => this.setState({ visible: false })}
                >
                    {
                        this.state.companyId && <Role companyId={this.state.companyId} companyName={this.state.companyName} />
                    }
                </Modal>
            </>
        )
    }

}