
import { Table, Space, Button, Modal } from 'antd';
import * as icons from '@ant-design/icons'
import React from 'react';
import CrudConfirm from './CrudConfirm'
import CrudModal from './CrudModal'



class CrudTable extends React.Component {

    constructor(props) {
        super(props)
        this.state.columns = this.getColumns(props)
    }

    state = {
        columns: [],
        page: {
            current: 1,
            size: 10,
            total: 0,
            list: []
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        rightDeleteConfirm: false,
        visible: false,
        formDefaultValues: {}
    }


    showHideText = (text, title, e) => {
        e.stopPropagation()
        Modal.success({
            centered: true,
            title: title,
            content: text
        })
    }


    /**
     * 获取包装后的列组合
     * @param {*} props 
     * @returns 
     */
    getColumns = (props) => {
        const newColumns = []
        for (let i in props.columns) {
            const column = {...props.columns[i]}
            // 隐藏不展示的字段
            if (column.show === false) {
                continue
            }
            // 隐藏文本，通过按钮展开
            if (column.hideText) {
                const oldHtml = column.html
                column.html = (text) => {
                    return oldHtml ? (
                        <Button type="link" onClick={(e) => this.showHideText(oldHtml(text),column.title,e)}>查看</Button>
                    ):(
                        <Button type="link" onClick={(e) => this.showHideText(text,column.title,e)}>查看</Button>
                    )
                }
            }
            if(column.type === 'icon'){
                const oldHtml = column.html
                column.html = (text) => {
                    if(!text){
                        return null
                    }
                    const Icon = icons[text]
                    return oldHtml ? oldHtml(Icon) : (
                        <Icon style={{fontSize: 20, color: '#40a9ff'}}/>
                    )
                }
            }
            newColumns.push(column)
        }
        // 是否显示行索引
        if (props.showIndex) {
            newColumns.splice(0, 0, {
                title: '#',
                key: 'table-index',
                align: 'center',
                html: (text, record, index) => {
                    return index + 1
                }

            })
        }
        // 添加右侧操作栏
        if (props.rightAction) {
            newColumns.push({
                title: '操作',
                key: 'table-action',
                align: 'center',
                fixed: 'right',
                html: (record) => (
                    <Space size="middle">
                        <Button type="primary" size='small' onClick={(e) => { this.editClick(record, e) }}>编辑</Button>
                        <CrudConfirm deleteSubmit={() => this.deleteSubmit([record])} />
                    </Space>
                )
            })
        }
        return newColumns
    }


    setVisible = (visible) => {
        this.setState({
            visible: visible
        })
    }


    /**
     * 点击编辑按钮
     */
    editClick = (record, e) => {
        e.stopPropagation()
        if (this.props.editClick) {
            this.props.editClick(record)
        }
        this.setState({
            formDefaultValues: record
        })
        this.setVisible(true)
    }

    /**
     * 提交删除
     * @param {*} record 
     */
    deleteSubmit = async (records) => {
        let current = this.state.page.current
        if (this.state.page.list.length - records.length === 0
            && Math.ceil(this.state.page.total / this.state.page.size) === this.state.page.current) {
            current = current - 1
        }
        if (this.props.onDelete) {
            if (await this.props.onDelete(records)) {
                this.getPage(current, this.state.page.size)
            }
        }
    }

    /**
     * 分页参数改变
     */
    getPage = async (page, pageSize) => {
        this.setState({
            loading: true
        })
        const newPage = {
            current: page || this.state.page.current,
            size: pageSize || this.state.page.size
        }
        const params = this.props.nodes.crudSearchRef ? { ...await this.props.nodes.crudSearchRef.getParams() } : {}
        if (this.props.onSearch) {
            this.props.onSearch(params, { ...newPage })
        }
        const pageInfo = await this.props.getPage(params, { ...newPage })
        newPage.list = pageInfo.list
        newPage.total = pageInfo.total
        this.setState({
            page: newPage,
            loading: false
        })
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length) {
            this.rowSelectionChange([])
        }
    }

    /**
     * 选中项改变
     */
    rowSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys || [],
            selectedRows: selectedRows
        })
        this.props.onSelection && this.props.onSelection(selectedRowKeys || [], selectedRows || [])
    }

    componentDidMount = () => {
        this.getPage()
    }

    render() {
        for (let column of this.state.columns) {
            /**
             * 如果column配置了dict，则加载字典表并进行映射
             */
            if (column.type === 'select' && column.dict) {
                const dict = this.props.dict && this.props.dict[column.dataIndex]
                if (!dict) {
                    continue
                }
                //配置了render，则回调参数变化为映射后的值
                if (column.html) {
                    column.render = (text) => {
                        for (let item of dict) {
                            if (String(item.value) === String(text)) {
                                return column.html(item.label)
                            }
                        }
                        return null
                    }
                }
                //没有配置render，直接输出映射后的值
                else {
                    column.render = (text) => {
                        for (let item of dict) {
                            if (String(item.value) === String(text)) {
                                return item.label
                            }
                        }
                        return null
                    }
                }
            }else{
                column.render = column.html
            }
        }
        return (
            <>
                <Table
                    pagination={{
                        position: ['bottomCenter'],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        current: this.state.page.current,
                        pageSize: this.state.page.size,
                        total: this.state.page.total,
                        showTotal: total => `共 ${total} 条记录`,
                        onChange: this.getPage
                    }}
                    loading={this.state.loading}
                    dataSource={this.state.page.list}
                    rowKey={record => {
                        return this.state.page.list.indexOf(record)
                    }}
                    scroll={{ x: 'max-content' }}
                    columns={this.state.columns}
                    rowSelection={
                        this.props.selection ? {
                            fixed: true,
                            onChange: this.rowSelectionChange,
                            selectedRowKeys: this.state.selectedRowKeys
                        } : null

                    }
                    onRow={record => {
                        return {
                            onClick: event => this.props.onRowClick ? this.props.onRowClick(record, event) : null
                        }
                    }}
                />
                <CrudModal
                    title='编辑'
                    formDefaultValues={this.state.formDefaultValues}
                    dict={this.props.dict}
                    search={this.getPage}
                    onSave={this.props.onSave}
                    columns={this.props.columns}
                    visible={this.state.visible}
                    setVisible={this.setVisible}
                />
            </>
        )
    }

}

export default CrudTable