import React from 'react';
import { Form, Row, Col, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class CrudForm extends React.Component {

    constructor(props) {
        super(props)
        // 如果表单有默认值，先将日期格式转换为moment
        if (props.formDefaultValues) {
            for (let column of props.columns) {
                if (column.type === "date") {
                    for (let key of Object.keys(props.formDefaultValues)) {
                        if (key === column.dataIndex && props.formDefaultValues[key]) {
                            props.formDefaultValues[key] = moment(props.formDefaultValues[key])
                            break
                        }
                    }
                }
                else if (column.type === "rangeDate") {
                    for (let key of Object.keys(props.formDefaultValues)) {
                        if (key === column.dataIndex && props.formDefaultValues[key]) {
                            for (let item of props.formDefaultValues[key]) {
                                item = moment(item)
                            }
                            break
                        }
                    }
                }
                else if (column.type === 'datetime') {
                    for (let key of Object.keys(props.formDefaultValues)) {
                        if (key === column.dataIndex && props.formDefaultValues[key]) {
                            props.formDefaultValues[key] = moment(props.formDefaultValues[key]).format("YYYY-MM-DDTHH:mm")
                            break
                        }
                    }
                }
            }
        }
    }

    createOptions = (dict) => {
        return dict.map(item => {
            return (
                <Option value={item.value} key={item.value}>{item.label}</Option>
            )
        })
    }

    createField = (column) => {
        if (column.dict && column.type === 'select') {
            return (
                <Select
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                    allowClear
                    placeholder={"请选择" + column.title}
                    showSearch
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.props.dict[column.dataIndex] ? this.createOptions(this.props.dict[column.dataIndex]) : null}
                </Select>
            )

        }
        else if ((column.type === 'date' || column.type === 'datetime') && column.range && this.props.title === '搜索') {
            return (
                <RangePicker
                    style={{ width: '100%' }}
                    picker='date'
                    allowClear
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                />
            )
        }
        else if (column.type === 'date') {
            return (
                <DatePicker
                    style={{ width: '100%' }}
                    picker='date'
                    placeholder={"请选择" + column.title}
                    allowClear
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                />
            )
        }
        else if (column.type === 'datetime') {
            return (
                <Input
                    style={{ width: '100%' }}
                    type='datetime-local'
                    picker='date'
                    placeholder={"请选择" + column.title}
                    allowClear
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                />
            )
        }
        else if(column.type === 'textarea' && (this.props.title === '编辑' || this.props.title === '新增')){
            return (
                <TextArea
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                    allowClear
                    placeholder={"请选择" + column.title}
                    rows={4}
                />
            )
        }
        else {
            return (
                <Input
                    placeholder={"请输入" + column.title}
                    allowClear
                    disabled={column.editEnable === false && this.props.title === '编辑'}
                    onPressEnter={() => { this.props.title === '搜索' && this.props.submit && this.props.submit() }}
                />
            )
        }
    }


    getFields = () => {
        const children = [];
        for (let i = 0; i < this.props.columns.length; i++) {
            const column = this.props.columns[i]
            if (column.addEnable === false && this.props.title === '新增') {
                continue
            }
            if (column.search === false && this.props.title === '搜索') {
                continue
            }
            if (column.editShow === false && this.props.title === '编辑') {
                continue
            }
            children.push(
                <Col span={this.props.title === '搜索' ? column.span || 6 : 12} key={i}>
                    <Form.Item
                        label={column.title}
                        name={column.dataIndex}
                        rules={this.props.title !== '搜索' && [
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


    getFormValue = async () => {
        let formValue = await this.formRef.validateFields()
        for (let column of this.props.columns) {
            if (column.type === "date") {
                for (let key of Object.keys(formValue)) {
                    if (key === column.dataIndex && formValue[key]) {
                        formValue[key] = formValue[key].format("YYYY-MM-DD")
                        break
                    }
                }
            }
            else if (column.type === "rangeDate") {
                for (let key of Object.keys(formValue)) {
                    if (key === column.dataIndex && formValue[key]) {
                        for (let item of formValue[key]) {
                            item = item.format("YYYY-MM-DD")
                        }
                        break
                    }
                }
            }
            else if (column.type === 'datetime') {
                for (let key of Object.keys(formValue)) {
                    if (key === column.dataIndex && formValue[key]) {
                        formValue[key] = moment(formValue[key]).format("YYYY-MM-DD HH:mm:ss")
                        break
                    }
                }
            }
        }
        if (this.props.title === '编辑') {
            formValue = Object.assign(this.props.formDefaultValues, formValue)
        }
        for (let key of Object.keys(formValue)) {
            formValue[key] = formValue[key] === '' ? undefined : formValue[key]
        }
        return formValue
    }


    render() {
        return (
            <Form
                initialValues={this.props.formDefaultValues || {}}
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