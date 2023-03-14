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
            if(item.defaultValue !== void 0){
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

    addClick = async () => {
        if (this.props.addClick && await this.props.addClick() === false) {
            return
        }
        this.setVisible(true)
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

    getBtns = () => {
        let config = []
        const btns = {
            "add": (<Button key="add" type="primary" icon={<PlusOutlined />} onClick={this.addClick}>新增</Button>),
            "delete": (<CrudConfirm 
                nodes={this.props.nodes} 
                deleteClick={this.props.deleteClick}  
                msg={this.props.deleteMsg} 
                key="delete" 
                deleteSubmit={this.deleteSubmit} 
                type='default' 
                before={() => this.props.nodes.crudTableRef.state.selectedRows.length}/>),
            "search": (<Button key="search" type="primary" icon={<SearchOutlined />} onClick={this.search}>搜索</Button>),
        }
        if(this.props.menuBtns === true){
            config = Object.keys(btns)
        }else if(Array.isArray(this.props.menuBtns)){
            config = this.props.menuBtns
        }
        return config.map(item => {
            return btns[item] || item(() => {
                return this.props.nodes.crudTableRef?.state.selectedRows.slice()
            })
        })
    }

    render() {
        return (
            <>
                <Space style={{ paddingBottom: 15 }}>
                    {this.getBtns()}
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
