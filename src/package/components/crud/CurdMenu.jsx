import { Space, Button, } from 'antd';
import React from 'react';
import { SearchOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import CrudModal from './CrudModal'
import CrudConfirm from './CrudConfirm';
import excel from '@/package/utils/excel'


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

    /**
     * 将数据导出excel文件
     */
    toExcel = () => {
        // 字典数据预处理
        const dict = {}
        for(let dictKey in this.props.dict){
            const dictMap = {}
            function columnDictMap(columnDict){
                if(!Array.isArray(columnDict)){
                    return
                }
                columnDict.forEach(item => {
                    dictMap[item.value] = item.label
                    columnDictMap(item.children)
                })
            }
            columnDictMap(this.props.dict[dictKey])
            dict[dictKey] = dictMap
        }
        const heads = {}
        this.props.columns.forEach(item => heads[item.dataIndex] = item.title)
        this.props.getPage().then(({list}) => {
            list.forEach(item => {
                for(let key in item){
                    // 需要进行字典映射
                    if(dict[key]){
                        item[key] = dict[key][item[key]]
                    }
                }
            })
            excel(heads, list, this.props.tableName)
        })
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
            "delete": (<CrudConfirm nodes={this.props.nodes} deleteClick={this.props.deleteClick}  msg={this.props.deleteMsg} key="delete" deleteSubmit={this.deleteSubmit} type='default' />),
            "search": (<Button key="search" type="primary" icon={<SearchOutlined />} onClick={this.search}>搜索</Button>),
            "excel": (<Button key="excel" type="primary" icon={<DownloadOutlined />} onClick={this.toExcel}>导出Excel</Button>)
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
