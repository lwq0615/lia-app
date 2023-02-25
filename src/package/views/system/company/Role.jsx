
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { Button, message, Modal } from "antd"
import { getSysRolePage, saveSysRole, deleteRoles, getRoleOfCompanyDict } from '@/package/request/system/role'
import { getAuthDict } from '@/package/request/system/auth'
import { getCreateByDict } from '@/package/request/system/user'
import { getSysRouterTree } from '@/package/request/system/router'
import { PartitionOutlined } from '@ant-design/icons';
import Diagram from "./Diagram"
import propTypes from 'prop-types'

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

async function getAuthTree() {
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
    const pDict = await getAuthDict()
    const rTree = routerMap((await getSysRouterTree())[0].children)
    pDict.forEach(item => {
        const parent = findNode(item, rTree)
        if (parent) {
            findNode(item, rTree).children.push(item)
        } else {
            rTree.push(item)
        }
    })
    return rTree
}



class Role extends React.Component {

    static propTypes = {
        companyId: propTypes.number.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            option: {
                // 是否显示行索引，默认true
                showIndex: true,
                // 是否展示右侧操作栏，默认["edit", "delete"]
                rightAction: ["detail", "edit", "delete"],
                // 表格行是否可选择(默认false)
                selection: true,
                // 配置显示的按钮
                menuBtns: ["add", "delete", "search", () => {
                    return (
                        <Button key="diagram" type="primary" onClick={this.diagram} icon={<PartitionOutlined />}>角色关系图</Button>
                    )
                }],
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
                getPage: (params = {}, page = {}) => {
                    params.companyId = this.props.companyId
                    params.createTime = params.createTime?.join(",")
                    return getSysRolePage(params, page.current, page.size)
                },
                // 新增编辑提交钩子 async (form, type) => {}
                // 如果需要获取返回值再关闭弹窗，请使用await
                // return true刷新页面并关闭弹窗
                onSave: async (form, type) => {
                    form.companyId = this.props.companyId
                    return await saveSysRole(form).then(res => {
                        message.success(type + "成功")
                        return true
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
                        title: '上级',
                        dataIndex: 'superior',
                        align: 'center',
                        key: 'superior',
                        type: "select",
                        dict: () => getRoleOfCompanyDict(this.props.companyId)
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
                        title: '权限',
                        dataIndex: 'auths',
                        align: 'center',
                        key: 'auths',
                        type: 'multipleTree',
                        dict: getAuthTree
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
        }
    }

    /**
     * 查看企业角色关系图
     */
    diagram = () => {
        Modal.info({
            title: this.props.companyName + "角色关系图",
            width: 1000,
            centered: true,
            destroyOnClose: true,
            keyboard: true,
            okText: "确定",
            content: (<Diagram companyId={this.props.companyId} />)
        })
    }

    render() {
        return (
            <Crud {...this.state.option} />
        )
    }
}

export default Role