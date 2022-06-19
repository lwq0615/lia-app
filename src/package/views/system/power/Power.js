
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message } from "antd"
import { getSysPowerPage, saveSysPower, deletePowers } from '@/package/request/system/power'
import { getUserDict } from '@/package/request/system/dict'
import { getSysRouterTree } from '@/package/request/system/router'
import RouterTree from "../router/RouterTree.js"
import './power.scss'


class Power extends React.Component {

    state = {
        option: {
            // 是否显示行索引，默认true
            showIndex: true,
            // 是否展示右侧操作栏，默认false
            rightAction: true,
            // 只展示表格，不展示搜索和按钮组（默认false）
            justShowTable: false,
            // 表格行是否可选择(默认false)
            selection: true,
            addClick: () => {
                if (!this.state.routerId && this.state.routerId !== 0) {
                    return false
                }
            },
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await deletePowers(records.map(item => item.powerId)).then(res => {
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
                return null
            },
            // 新增编辑提交钩子 async (form, type) => {}
            // 如果需要获取返回值再关闭弹窗，请使用await
            // return true刷新页面并关闭弹窗
            onSave: async (form, type) => {
                return null
            },
            columns: [
                {
                    title: '权限名称',
                    dataIndex: 'name',
                    align: 'center',
                    key: 'name',
                    required: true
                },
                {
                    title: '接口路径',
                    dataIndex: 'url',
                    align: 'center',
                    key: 'url',
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
        },
        routerTreeData: [],
        routerId: null
    }

    crudRef = null

    onTreeSelect = (a, [key]) => {
        this.setState({
            routerId: key
        })
        if(!key){
            return
        }
        const option = this.state.option
        option.getPage = (params, page) => {
            params.createTime = params.createTime?.join(",")
            params.routerId = key
            return getSysPowerPage(params, page.current, page.size)
        }
        option.onSave = async (form, type) => {
            form.routerId = key
            return await saveSysPower(form).then(res => {
                if (res === 'success') {
                    message.success(type + "成功")
                    return true
                }
                else if (res === 'error') {
                    message.error("未知错误")
                    return false
                }
                else {
                    message.warning(res)
                    return false
                }
            })
        }
        this.forceUpdate()
        this.crudRef?.refreshPage()
    }

    componentDidMount = async () => {
        this.setState({
            routerTreeData: (await getSysRouterTree())[0].children
        })
    }

    render() {
        return (
            <section className="system-power">
                <RouterTree
                    onSelect={this.onTreeSelect}
                    routerTree={this.state.routerTreeData}
                />
                <Crud
                    className="system-power-crud"
                    ref={ref => this.crudRef = ref}
                    {...this.state.option}
                />
            </section>
        )
    }
}

export default Power