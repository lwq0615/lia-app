import React from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
const { Option } = Select;

class CrudForm extends React.Component {

    dict = {}

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

    createField = (column) => {
        if (column.dict) {
            return (
                <Select
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                    allowClear
                    placeholder={"请选择" + column.title}
                    showSearch
                >
                    {this.dict[column.dataIndex] ? this.createOptions(this.dict[column.dataIndex]) : null}
                </Select>
            )

        } else {
            return (
                <Input
                    placeholder={"请输入" + column.title}
                    allowClear
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                />
            )
        }
    }


    getFields = () => {
        const children = [];

        for (let i = 0; i < this.props.columns.length; i++) {
            const column = this.props.columns[i]
            if (column.key === 'table-action') {
                continue
            }
            if (column.addEnable === false && this.props.title === '新增') {
                continue
            }
            children.push(
                <Col span={12} key={i}>
                    <Form.Item
                        label={column.title}
                        name={column.dataIndex}
                        rules={[
                            {
                                required: column.required
                            },
                        ]}
                    >
                        {this.createField(column)}
                    </Form.Item>
                </Col>
            );
        }

        return children;
    }

    render() {
        return (
            <Form
                name="advanced_search"
                className="ant-advanced-search-form"
                ref={ref => this.formRef = ref}
            >
                <Row gutter={24}>{this.getFields()}</Row>
            </Form>
        );
    }
};

export default CrudForm