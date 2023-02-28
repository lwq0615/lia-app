
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message, Button, Modal, Spin } from "antd"
import { getSysAuthPage, saveSysAuth, deleteAuths, moveAuthToRouter } from '@/package/request/system/auth'
import { getCreateByDict } from '@/package/request/system/user'
import { getSysRouterTree } from '@/package/request/system/router'
import { getDictByKey } from "@/package/request/system/dictData"
import RouterTree from "../router/RouterTree"
import { ArrowRightOutlined } from '@ant-design/icons';
import './auth.scss'


class Auth extends React.Component {

    /**
     * 当前选中的权限
     */
    selectData = []

    state = {
        visible: false,
        moveing: false,
        option: {
            // 是否显示行索引，默认true
            showIndex: true,
            // 是否展示右侧操作栏，默认false
            rightAction: true,
            // 表格行是否可选择(默认false)
            selection: true,
            menuBtns: ["add", "delete", "search", (getSelect) => {
                const move = () => {
                    this.selectData = getSelect()
                    if (!this.selectData?.length) {
                        return
                    }
                    this.setState({ visible: true })
                }
                return (
                    <Button key="moveTo" onClick={move} icon={<ArrowRightOutlined />}>移动到</Button>
                )
            }],
            addClick: () => {
                if (!this.state.routerId && this.state.routerId !== 0) {
                    message.warning("请先选择一个路由菜单")
                    return false
                }
            },
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await deleteAuths(records.map(item => item.authId)).then(res => {
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
                    title: '权限类型',
                    dataIndex: 'type',
                    align: 'center',
                    key: 'type',
                    required: true,
                    type: 'select',
                    dict: () => getDictByKey('sys:auth:type'),
                    defaultValue: '0'
                },
                {
                    title: '接口路径',
                    dataIndex: 'url',
                    align: 'center',
                    key: 'url',
                    placeholder: "类型为接口时接口路径必填"
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
                    dataIndex: 'creater',
                    align: 'center',
                    key: 'creater',
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
        },
        routerTreeData: [],
        routerId: null
    }

    crudRef = null

    onTreeSelect = (key) => {
        this.setState({
            routerId: key
        })
        if (!key) {
            return
        }
        const option = this.state.option
        option.getPage = (params = {}, page = {}) => {
            params.createTime = params.createTime?.join(",")
            params.routerId = key
            return getSysAuthPage(params, page.current, page.size)
        }
        option.onSave = async (form, type) => {
            form.routerId = key
            if(form.type === '0' && !form.url){
                message.warning("类型为接口时接口路径必填")
                return false
            }
            return await saveSysAuth(form).then(res => {
                message.success(type + "成功")
                return true
            })
        }
        this.forceUpdate()
        this.crudRef?.refreshPage()
    }


    moveTo = (routerId) => {
        const success = () => {
            this.setState({
                moveing: false,
                visible: false
            })
            message.success("操作成功")
        }
        const error = () => {
            this.setState({
                moveing: false
            })
            message.error("操作失败")
        }
        const authIds = this.selectData.map(auth => auth.authId)
        if (!authIds.length) {
            return
        }
        if (this.selectData[0].routerId === routerId) {
            success()
            return
        }
        this.setState({
            moveing: true
        })
        moveAuthToRouter(authIds, routerId).then((res) => {
            if (res > 0) {
                success()
                this.crudRef.refreshPage()
            } else {
                error()
            }
        }).catch(() => {
            error()
        })
    }

    componentDidMount = async () => {
        this.setState({
            routerTreeData: (await getSysRouterTree())[0].children
        })
    }

    render() {
        return (
            <section className="system-auth">
                <RouterTree
                    onSelect={this.onTreeSelect}
                    routerTree={this.state.routerTreeData}
                    reloadTree={() => this.componentDidMount()}
                />
                <Crud
                    className="system-auth-crud"
                    ref={ref => this.crudRef = ref}
                    {...this.state.option}
                />
                <Modal
                    centered
                    destroyOnClose
                    keyboard
                    title="移动至"
                    open={this.state.visible}
                    footer={null}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Spin spinning={this.state.moveing}>
                        <RouterTree
                            onSelect={this.moveTo}
                            routerTree={this.state.routerTreeData}
                        />
                    </Spin>
                </Modal>
            </section>
        )
    }
}

export default Auth