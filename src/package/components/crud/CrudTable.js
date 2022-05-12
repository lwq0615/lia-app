
import { Table, Space, Button } from 'antd';
import React from 'react';


class CrudTable extends React.Component {

    constructor(props) {
        super(props)
        // 添加右侧操作栏
        if (props.rightAction === false) {
            return
        }
        if (props.columns[props.columns.length - 1].key !== 'table-action') {
            props.columns.push({
                title: '操作',
                key: 'table-action',
                align: 'center',
                fixed: 'right',
                render: (record) => (
                    <Space size="middle">
                        <Button type="primary" size='small' onClick={(e) => { this.editClick(record, e) }}>编辑</Button>
                        <Button type="primary" danger size='small' onClick={(e) => { this.deleteClick(record, e) }}>删除</Button>
                    </Space>
                )
            })
        }
    }

    dict = {}


    /**
     * 加载或获取字典表
     * @param {} source 字典表数据源
     * @param {*} dictKey  字典表key
     * @returns  字典表
     */
    getDict = async (dictKey, source) => {
        if (this.dict[dictKey]) {
            return this.dict[dictKey]
        } else if(source) {
            let dict = null
            if (typeof source === 'function') {
                dict = await source()
            } else {
                dict = source
            }
            this.dict[dictKey] = dict
            return dict
        }else{
            return null
        }
    }

    state = {
        page: {
            current: 1,
            size: 10,
            total: 0,
            list: []
        },
        loading: false
    }

    /**
     * 点击编辑按钮
     */
    editClick = (record, e) => {
        e.stopPropagation()
        if (this.props.editClick) {
            this.props.editClick(record)
        }
    }

    /**
     * 点击删除按钮
     * @param {*} record 当前行数据
     * @param {*} e 事件对象
     */
    deleteClick = (record, e) => {
        e.stopPropagation()
        if (this.props.deleteClick) {
            this.props.deleteClick(record)
        }
    }

    /**
     * 分页参数改变
     */
    getPage = async (page, pageSize) => {
        this.state.page.current = page || this.state.page.current
        this.state.page.size = pageSize || this.state.page.size
        this.setState({
            loading: true,
            page: this.state.page
        })
        const params = { ...this.props.nodes.crudSearchRef.state.params }
        for(let key of Object.keys(params)){
            params[key] = params[key] === '' ? undefined : params[key]
        }
        if (this.props.onSearch) {
            this.props.onSearch(params, {
                current: this.state.page.current,
                size: this.state.page.size
            })
        }
        const pageInfo = await this.props.getPage(params, {
            current: this.state.page.current,
            size: this.state.page.size
        })
        this.state.page.list = pageInfo.list
        this.state.page.total = pageInfo.total
        this.setState({
            page: this.state.page,
            loading: false
        })
    }

    componentDidMount = async () => {
        this.getPage()
        /**
         * 如果column配置了dict，则加载字典表并进行映射
         */
        for (let column of this.props.columns) {
            if (column.dict) {
                const dict = await this.getDict(column.dataIndex, column.dict)
                //配置了render，则回调参数变化为映射后的值
                if (column.render) {
                    const oldRender = column.render
                    column.render = (text) => {
                        for (let item of dict) {
                            if (String(item.value) === String(text)) {
                                return oldRender(item.label)
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
            }
        }
        this.forceUpdate()
    }

    render() {
        return (
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
                columns={this.props.columns}
                rowSelection={
                    this.props.selection ? {
                        fixed: true,
                        onChange: this.props.selection
                    } : null

                }
                onRow={record => {
                    return {
                        onClick: event => this.props.onRowClick ? this.props.onRowClick(record, event) : null
                    }
                }}
            />
        )
    }

}

export default CrudTable