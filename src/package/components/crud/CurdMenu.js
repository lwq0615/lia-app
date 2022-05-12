import { Space, Button, } from 'antd';
import React from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CrudModal from './CrudModal'


class CrudMenu extends React.Component {

    state = {
        visible: false
    }

    search = () => {
        this.props.nodes.crudTableRef.getPage()
    }

    addClick = () => {
        this.setState({
            visible: true
        })
        if (this.props.addClick) {
            this.props.addClick()
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
                    <Button type="primary" icon={<SearchOutlined />} onClick={this.search}>搜索</Button>
                </Space>
                <CrudModal
                    title='新增'
                    onSubmit={this.props.onSubmit}
                    columns={this.props.columns}
                    visible={this.state.visible}
                    setVisible={this.setVisible}
                />
            </>
        )
    }

}

export default CrudMenu
