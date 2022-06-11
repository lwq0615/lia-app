
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message } from "antd"
import { getSysUserPage, saveSysUser, deleteUsers } from '@/package/request/system/user'
import { getRoleDict, getSexDict, getUserDict } from '@/package/request/system/dict'

const option = {
    // 是否显示行索引，默认true
    showIndex: true,
    // 是否展示右侧操作栏，默认false
    rightAction: true,
    // 只展示表格，不展示搜索和按钮组（默认false）
    justShowTable: false,
    // 表格行是否可选择(默认false)
    selection: true,
    // 触发删除钩子 records => {}
    //return true刷新页面数据
    onDelete: async records => {
        return await deleteUsers(records.map(item => item.userId)).then(res => {
            if(res > 0){
                message.success("删除成功")
                return true
            }else{
                message.error("删除失败")
                return false
            }
        })
    },
    // 需要加载数据时触发 params => {}
    getPage: (params, page) => {
        params.createTime = params.createTime?.join(",")
        return getSysUserPage(params, page.current, page.size)
    },
    // 新增编辑提交钩子 async (form, type) => {}
    // 如果需要获取返回值再关闭弹窗，请使用await
    // return true刷新页面
    onSave: async (form, type) => {
        return await saveSysUser(form).then(res => {
            if(res === "用户名已存在"){
                message.warning(res)
                return false
            }else if(res === 'success'){
                message.success(type+"成功")
                return true
            }else{
                message.error("未知错误")
                return false
            }
        })
    },
    columns: [
        {
            title: '用户名',
            dataIndex: 'username',
            align: 'center',
            key: 'username',
            required: true,
            // 不允许编辑该列的值
            // editEnable: false
        },
        {
            title: '密码',
            dataIndex: 'password',
            align: 'center',
            key: 'password',
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
            key: 'nick',
            required: true
        },
        {
            title: '角色',
            dataIndex: 'roleId',
            align: 'center',
            key: 'roleId',
            required: true,
            // type为select时必须提供dict
            type: "select",
            // 配置了select后dict才会生效
            dict: getRoleDict
        },
        {
            title: '性别',
            dataIndex: 'sex',
            align: 'center',
            key: 'sex',
            type: "select",
            // 新增时的默认值
            // defaultValue: '0',
            dict: getSexDict,
            // 自定义要渲染的内容 (text) => {}
            // 如果配置了dict，text为字典映射后的内容
            html: (text) => {
                return text
            }
        },
        {
            title: '电话',
            dataIndex: 'phone',
            align: 'center',
            key: 'phone'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align: 'center',
            key: 'email'
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            align: 'center',
            key: 'status',
            addEnable: false,
            type: "select",
            dict: [
                {label: '正常',value: '0'},
                {label: '停用',value: '1'}
            ]
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            align: 'center',
            key: 'createBy',
            addEnable: false,
            type: "select",
            dict: getUserDict
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            key: 'createTime',
            addEnable: false,
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
}


class User extends React.Component {

    state = {
        option: option
    }

    render() {
        return (
            <Crud {...this.state.option}/>
        )
    }
}

export default User