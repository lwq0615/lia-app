import { Space, Button, } from 'antd';
import React from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CrudModal from './CrudModal'
import CrudConfirm from './CrudConfirm';


class CrudMenu extends React.Component {

    constructor(props){
        super(props)
        const formDefaultValues = {}
        props.columns.forEach(item => {
            if(item.defaultValue !== undefined){
                formDefaultValues[item.dataIndex] = item.defaultValue
            }
        })
        this.state = {
            visible: false,
            formDefaultValues
        }
    }

    search = () => {
        this.props.nodes.crudTableRef.getPage()
    }

    addClick = () => {
        this.setVisible(true)
        if (this.props.addClick) {
            this.props.addClick()
        }
    }

    deleteSubmit = async () => {
        if (this.props.nodes.crudTableRef.state.selectedRows.length) {
            const records = [...this.props.nodes.crudTableRef.state.selectedRows]
            await this.props.nodes.crudTableRef.deleteSubmit(records)
        }
    }

    setVisible = (visible) => {
        this.setState({
            visible: visible
        })
    }

    render() {
        return (
            <>
                <Space style={{ paddingBottom: 15 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={this.addClick}>新增</Button>
                    <CrudConfirm deleteSubmit={this.deleteSubmit} type='default' />
                    <Button type="primary" icon={<SearchOutlined />} onClick={this.search}>搜索</Button>
                </Space>
                <CrudModal
                    title='新增'
                    dict={this.props.dict}
                    search={this.search}
                    onSave={this.props.onSave}
                    columns={this.props.columns}
                    visible={this.state.visible}
                    formDefaultValues={this.state.formDefaultValues}
                    setVisible={this.setVisible}
                />
            </>
        )
    }

}

export default CrudMenu
