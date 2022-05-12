import { Row, Col, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

class CrudSearch extends React.Component {

    state = {
        params: {}
    }

    dict = {}

    search = () => {
        this.props.nodes.crudTableRef.getPage()
    }

    bindValue = e => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        this.state.params[e.target.name] = value
    }

    componentDidMount = async () => {
        for (let column of this.props.columns) {
            if (column.dict) {
                let dict = null
                if (typeof column.dict === 'function') {
                    dict = await column.dict()
                } else {
                    dict = column.dict
                }
                this.dict[column.dataIndex] = dict
            }
        }
        this.forceUpdate()
    }

    createOptions = (dict) => {
        return dict.map(item => {
            return (
                <Option value={item.value} key={item.value}>{item.label}</Option>
            )
        })
    }

    createRow = (columns) => {
        return columns.map(column => {
            if (column.key === 'table-action') {
                return null
            }
            if (column.search === false) {
                return null
            }
            if(column.dict){
                return (
                    <Col span={6} key={column.key} style={{display: 'table'}}>
                        <span style={{display: "table-cell"}} className='ant-input-group-addon'>{column.title}</span>
                        <Select
                            allowClear
                            onChange={(value) => {this.bindValue({target:{type: 'select',value: value,name: column.dataIndex}})}}
                            style={{width: '100%'}}
                            key={column.dataIndex}
                            showSearch
                            placeholder={"请选择" + column.title}
                        >
                            {this.dict[column.dataIndex] ? this.createOptions(this.dict[column.dataIndex]) : null}
                        </Select>
                    </Col>
                )
            }
            return (
                <Col span={6} key={column.key}>
                    <Input
                        name={column.dataIndex}
                        addonBefore={column.title}
                        allowClear
                        onPressEnter={this.search}
                        onChange={this.bindValue}
                    />
                </Col>
            )
        })
    }

    render() {
        return (
            <Row gutter={[16, 12]} style={{ paddingBottom: 15 }}>
                {this.createRow(this.props.columns)}
            </Row>
        )
    }

}

export default CrudSearch