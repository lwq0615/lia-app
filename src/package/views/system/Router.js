
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message } from "antd"
import { getSysRouterPage, saveSysRouter, deleteRouters } from '@/package/request/system/router'
import { getRouterDict, getUserDict } from '@/package/request/system/dict'

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
        return await deleteRouters(records.map(item => item.routerId)).then(res => {
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
        return getSysRouterPage(params, page.current, page.size)
    },
    // 新增编辑提交钩子 async (form, type) => {}
    // 如果需要获取返回值再关闭弹窗，请使用await
    // return true刷新页面
    onSave: async (form, type) => {
        return await saveSysRouter(form).then(res => {
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
            title: '路由名称',
            dataIndex: 'label',
            align: 'center',
            key: 'label',
            required: true
        },
        {
            title: '路由地址',
            dataIndex: 'path',
            align: 'center',
            key: 'path',
            required: true
        },
        {
            title: '组件地址',
            dataIndex: 'element',
            align: 'center',
            key: 'element'
        },
        {
            title: '父路由',
            dataIndex: 'parent',
            align: 'center',
            key: 'parent',
            // type为select时必须提供dict
            type: "select",
            //TODO 配置了select后dict才会生效
            dict: getRouterDict
        },
        {
            title: '排序',
            dataIndex: 'index',
            align: 'center',
            type: 'number',
            key: 'index'
        },
        {
            title: '图标',
            dataIndex: 'icon',
            align: 'center',
            key: 'icon',
            type: 'icon'
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
            range: false,
            //该列在搜索框所占宽度，最大24,默认6
            span: 6
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


class Router extends React.Component {

    state = {
        option: option
    }

    render() {
        return (
            <Crud {...this.state.option}/>
        )
    }
}

export default Router