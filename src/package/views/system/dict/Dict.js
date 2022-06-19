
import React from "react"
import Crud from "@/package/components/crud/Crud"
import { message, Menu, Button, Space, Modal } from "antd"
import { getSysDictPage, saveSysDict, deleteDicts, getUserDict, typeNameMap } from '@/package/request/system/dict'
import DictForm from "./DictForm"
import "./dict.scss"


class Dict extends React.Component {

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
                if (!this.state.formValue?.type) {
                    return false
                }
            },
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await deleteDicts(records.map(item => item.dictId)).then(res => {
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
                return []
            },
            // 新增编辑提交钩子 async (form, type) => {}
            // 如果需要获取返回值再关闭弹窗，请使用await
            // return true刷新页面并关闭弹窗
            onSave: async (form, type) => {
                return false
            },
            columns: [
                {
                    title: '字典值',
                    dataIndex: 'label',
                    align: 'center',
                    key: 'label',
                    required: true
                },
                {
                    title: '字典key',
                    dataIndex: 'value',
                    align: 'center',
                    key: 'value',
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
                    range: true,
                    type: "datetime",
                    span: 12
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    align: 'center',
                    key: 'remark',
                    hideText: true,
                    span: 12
                }
            ]
        },
        dicts: [],
        formValue: null,
        visible: false
    }

    crudRef = null

    menuClick = (e) => {
        this.setState({
            formValue: {
                type: e.key,
                name: e.domEvent.target.innerText
            }
        })
        const option = this.state.option
        option.getPage = (params, page) => {
            params.createTime = params.createTime?.join(",")
            params.type = e.key
            return getSysDictPage(params, page.current, page.size)
        }
        option.onSave = async (form, type) => {
            form.type = e.key
            form.name = e.domEvent.target.innerText
            return await saveSysDict(form).then(res => {
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

    add = () => {
        this.setState({
            formValue: void 0,
            visible: true
        })
    }

    edit = () => {
        if (this.state.formValue) {
            this.setState({
                visible: true
            })
        }
    }

    reloadMenu = () => {
        this.componentDidMount()
    }

    componentDidMount = () => {
        typeNameMap().then(res => {
            this.setState({
                dicts: res.map(item => {
                    return {
                        key: item.value,
                        label: item.label
                    }
                })
            })
        })
    }

    render() {
        return (
            <section className="system-dict_container">
                <div style={{ height: '100%' }}>
                    <Space style={{paddingBottom: '5px'}}>
                        <Button type="primary" onClick={this.add}>新增</Button>
                        <Button type="primary" onClick={this.edit}>编辑</Button>
                    </Space>
                    <Menu
                        selectedKeys={[this.state.formValue?.type]}
                        className="system-dict-menu"
                        items={this.state.dicts}
                        onClick={this.menuClick}
                    />
                </div>
                <Crud
                    ref={ref => this.crudRef = ref}
                    {...this.state.option}
                    className="system-dict-crud"
                />
                <Modal
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    centered={true}
                    title="新增字典"
                    destroyOnClose={true}
                    width={700}
                    footer={null}
                    closable={true}
                >
                    <DictForm
                        reloadMenu={this.reloadMenu}
                        setVisible={(bool) => this.setState({ visible: bool })}
                        formValue={this.state.formValue}
                        refreshPage={() => this.crudRef?.refreshPage()}
                    />
                </Modal>
            </section>
        )
    }
}

export default Dict