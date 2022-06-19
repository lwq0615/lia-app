
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message } from "antd"
import { getSysRolePage, saveSysRole, deleteRoles } from '@/package/request/system/role'
import { getUserDict, getPowerDict } from '@/package/request/system/dict'
import { getSysRouterTree } from '@/package/request/system/router'

async function getRouterTree() {
    function routerMap(routers) {
        if (!routers) {
            return null
        }
        return routers.map(router => {
            return {
                label: router.label,
                value: router.routerId,
                children: routerMap(router.children)
            }
        })
    }
    return routerMap(await getSysRouterTree())
}


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
        return await deleteRoles(records.map(item => item.roleId)).then(res => {
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
        return getSysRolePage(params, page.current, page.size)
    },
    // 新增编辑提交钩子 async (form, type) => {}
    // 如果需要获取返回值再关闭弹窗，请使用await
    // return true刷新页面并关闭弹窗
    onSave: async (form, type) => {
        return await saveSysRole(form).then(res => {
            if (res === "标识符已存在") {
                message.warning(res)
                return false
            } else if (res === 'success') {
                message.success(type + "成功")
                return true
            } else {
                message.error("未知错误")
                return false
            }
        })
    },
    columns: [
        {
            title: '角色名称',
            dataIndex: 'name',
            align: 'center',
            key: 'name',
            required: true,
            // 不允许编辑该列的值
            // editEnable: false
        },
        {
            title: '标识符',
            dataIndex: 'key',
            align: 'center',
            key: 'key',
            required: true
        },
        {
            title: '权限',
            dataIndex: 'powers',
            align: 'center',
            key: 'powers',
            type: 'multipleTree',
            dict: async () => {
                function routerMap(routers) {
                    if (!routers) {
                        return null
                    }
                    return routers.map(router => {
                        return {
                            label: router.label,
                            value: "router-" + router.routerId,
                            checkable: false,
                            children: routerMap(router.children)
                        }
                    })
                }
                function findNode(item, arr) {
                    if (!arr.length) {
                        return null
                    }
                    let newArr = []
                    for (let node of arr) {
                        if (node.value === "router-" + item.remark) {
                            if (!node.children) {
                                node.children = []
                            }
                            return node
                        }
                        if (node.children) {
                            newArr = newArr.concat(node.children)
                        }
                    }
                    return findNode(item, newArr)
                }
                const pDict = await getPowerDict()
                const rTree = routerMap((await getSysRouterTree())[0].children)
                pDict.forEach(item => {
                    const parent = findNode(item, rTree)
                    if(parent){
                        findNode(item, rTree).children.push(item)
                    }else{
                        rTree.push(item)
                    }
                })
                return rTree
            }
        },
        {
            title: '路由',
            dataIndex: 'routers',
            align: 'center',
            key: 'routers',
            type: 'multipleTree',
            dict: async () => {
                return (await getRouterTree())[0].children
            }
        },
        {
            title: '根路由',
            dataIndex: 'rootRouterId',
            align: 'center',
            key: 'rootRouterId',
            required: true,
            type: 'tree',
            dict: getRouterTree
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
            range: true
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


class Role extends React.Component {

    state = {
        option: option
    }

    render() {
        return (
            <Crud {...this.state.option} />
        )
    }
}

export default Role