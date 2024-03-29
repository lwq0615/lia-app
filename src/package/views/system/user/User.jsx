
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message, Button } from "antd"
import { getSysUserPage, saveSysUser, deleteUsers, getCreaterDict } from '@/package/request/system/user'
import { getSexDict, getUserStatusDict } from '@/package/request/system/dictData'
import { getRoleDict } from '@/package/request/system/role'
import { getCompanyDict } from '@/package/request/system/company'
import { DownloadOutlined } from '@ant-design/icons';
import { excelServer } from "@/package/utils/excel"


class User extends React.Component {

    state = {
        option: {
            // 是否显示行索引，默认true
            showIndex: true,
            // 是否展示右侧操作栏，默认false
            rightAction: true,
            // 表格行是否可选择(默认false)
            selection: true,
            menuBtns: ["add", "delete", "search", () => {
                const exportExcel = async () => {
                    excelServer({
                        url: "/system/user/excel",
                        method: 'post',
                        data: this.params
                    })
                }
                return (
                    <Button key="excel" type="primary" icon={<DownloadOutlined />} onClick={exportExcel}>导出Excel</Button>
                )
            }],
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await deleteUsers(records.map(item => item.userId)).then(res => {
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
                return getSysUserPage(params, page.current, page.size)
            },
            // 新增编辑提交钩子 async (form, type) => {}
            // 如果需要获取返回值再关闭弹窗，请使用await
            // return true刷新页面
            onSave: async (form, type) => {
                if (form.phone && !/^[1]([3-9])[0-9]{9}/.test(form.phone)) {
                    message.warning("请输入正确的手机号")
                    return
                }
                return await saveSysUser(form).then(res => {
                    message.success(type + "成功")
                    return true
                })
            },
            columns: [
                {
                    title: '用户ID',
                    dataIndex: 'userId',
                    align: 'center',
                    addShow: false,
                    editShow: false
                },
                {
                    title: '用户名',
                    dataIndex: 'username',
                    align: 'center',
                    required: true,
                    // 不允许编辑该列的值
                    // editEnable: false
                },
                {
                    title: '密码',
                    dataIndex: 'password',
                    align: 'center',
                    editShow: false,
                    required: true,
                    // 在表格内不显示该列，不影响新增和编辑
                    show: false,
                    // 不在搜索条件内显示该字段
                    search: false
                },
                {
                    title: '昵称',
                    dataIndex: 'nick',
                    align: 'center',
                    required: true
                },
                {
                    title: '企业',
                    dataIndex: 'companyId',
                    align: 'center',
                    addShow: false,
                    editShow: false,
                    // type为select时必须提供dict
                    type: "select",
                    // 配置了select后dict才会生效
                    dict: getCompanyDict
                },
                {
                    title: '角色',
                    dataIndex: 'roleId',
                    align: 'center',
                    required: true,
                    addShow: false,
                    // type为select时必须提供dict
                    type: "tree",
                    // 配置了select后dict才会生效
                    dict: () => {
                        const roleTreeDict = []
                        return getRoleDict().then(res => {
                            const companyRoleTree = {}
                            res.forEach(item => {
                                if (!Array.isArray(companyRoleTree[item.remark])) {
                                    companyRoleTree[item.remark] = []
                                }
                                companyRoleTree[item.remark].push(item)
                            })
                            Object.keys(companyRoleTree).forEach(item => {
                                roleTreeDict.push({
                                    label: item,
                                    value: Symbol(item).toString(),
                                    selectable: false,
                                    children: companyRoleTree[item]
                                })
                            })
                            return roleTreeDict
                        })
                    }
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    align: 'center',
                    type: "select",
                    // 新增时的默认值
                    // defaultValue: '2',
                    dict: getSexDict,
                    // 自定义要渲染的内容 (text, record) => {}
                    // 如果配置了dict，text为字典映射后的内容
                    // html: (text) => {
                    //     return text
                    // }
                },
                {
                    title: '电话',
                    dataIndex: 'phone',
                    align: 'center',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    align: 'center',
                },
                {
                    title: '账号状态',
                    dataIndex: 'status',
                    align: 'center',
                    type: "select",
                    dict: getUserStatusDict
                },
                {
                    title: '创建人',
                    dataIndex: 'creater',
                    align: 'center',
                    addShow: false,
                    editShow: false,
                    type: "select",
                    dict: getCreaterDict
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    align: 'center',
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
                    type: "textarea",
                    // 是否隐藏文本，通过点击按钮展开（默认false）
                    hideText: true
                }
            ]
        }
    }

    params = {}

    render() {
        return (
            <Crud style={{ padding: 24 }} {...this.state.option}/>
        )
    }
}

export default User