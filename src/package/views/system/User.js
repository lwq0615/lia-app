
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message } from "antd"
import { getSysUserPage, saveSysUsers } from '@/package/request/system/user'
import { getRoleDict, getSexDict } from '@/package/request/system/dict'

const option = {
    // 是否展示右侧操作栏，默认true
    rightAction: true,
    // 表格行是否可选择 (selectedRowKeys, selectedRows) => {}
    // 该方法在选中选中项发生变化钩子
    selection: (selectedRowKeys, selectedRows) => {
        console.log("选中的key" + selectedRowKeys);
        console.log("选中的行数据" + selectedRows);
    },
    //点击新增触发事件 () => {}
    addClick: () => {
        console.log("新增");
    },
    // 搜索时触发 (params, page) => {}
    onSearch: (params, page) => {
        console.log("搜索");
    },
    // 表格行点击事件钩子 (record, event) => {}
    onRowClick: (record, event) => {
        console.log(record);
        console.log(event);
    },
    // 点击行编辑按钮钩子 record => {}
    editClick: record => {
        console.log(record);
    },
    // 点击行删除按钮钩子 record => {}
    deleteClick: record => {
        console.log(record);
    },
    // 需要加载数据时触发 params => {}
    getPage: (params, page) => {
        return getSysUserPage(params, page.current, page.size)
    },
    // 新增编辑提交钩子 async (form, type) => {}
    // 如果需要获取返回值再关闭弹窗，请使用await
    onSubmit: async (form, type) => {
        if(form && await saveSysUsers(form) > 0){
            message.success(type +"成功")
        }
    },
    columns: [
        {
            title: '用户名',
            dataIndex: 'username',
            align: 'center',
            key: 'username',
            required: true,
            editEnable: false
        },
        {
            title: '密码',
            dataIndex: 'password',
            align: 'center',
            key: 'password',
            required: true
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
            dict: getRoleDict
        },
        {
            title: '性别',
            dataIndex: 'sex',
            align: 'center',
            key: 'sex',
            dict: getSexDict
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
            addEnable: false
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            key: 'createTime'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            key: 'remark'
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