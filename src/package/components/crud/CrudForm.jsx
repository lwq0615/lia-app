import React from 'react';
import { Form, Row, Col, Input, Select, DatePicker, InputNumber, TreeSelect, Switch, Button } from 'antd';
import CrudCheckbox from '../form/Checkbox';
import CrudMultipleTree from '../form/MultipleTree';
import Icons from './Icons';
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
                if (column.type === 'switch') {
                    const columnDict = props.dict[column.dataIndex]
                    props.formDefaultValues[column.dataIndex] = columnDict && columnDict[0].value === props.formDefaultValues[column.dataIndex]
                    continue
                }
                // 没有默认值
                if (props.formDefaultValues[column.dataIndex] === void 0) {
                    continue
                }
                if (column.type === "date") {
                    props.formDefaultValues[column.dataIndex] = moment(props.formDefaultValues[column.dataIndex])
                    continue
                }
                else if (column.type === 'datetime') {
                    props.formDefaultValues[column.dataIndex] = moment(props.formDefaultValues[column.dataIndex]).format("YYYY-MM-DDTHH:mm")
                    continue
                }
            }
        }
    }


    /**
     * 生成Select组件的Option
     * @param {*} dict 
     * @returns 
     */
    createOptions = (dict) => {
        return dict.map(item => {
            return (
                <Option value={item.value} key={item.value}>{item.label}</Option>
            )
        })
    }

    /**
     * 将字典中的label换为title
     * @param {*} treeData 
     */
    treeDataMap = (treeData) => {
        if (!treeData) {
            return null
        }
        return treeData.map(item => {
            return Object.assign({ ...item }, {
                title: item.label,
                value: item.value,
                children: this.treeDataMap(item.children)
            })
        })
    }

    createField = (column) => {
        const disabled = (column.editEnable === false && this.props.title === '编辑') || this.props.title === '详情'
        if (column.dict && column.type === 'select') {
            return (
                <Select
                    disabled={disabled}
                    allowClear
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请选择" + column.title) : ''}
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
                    disabled={disabled}
                />
            )
        }
        else if (column.type === 'date') {
            return (
                <DatePicker
                    style={{ width: '100%' }}
                    picker='date'
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请选择" + column.title) : ''}
                    allowClear
                    disabled={disabled}
                />
            )
        }
        else if (column.type === 'datetime') {
            return (
                <Input
                    style={{ width: '100%' }}
                    type='datetime-local'
                    picker='date'
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请选择" + column.title) : ''}
                    allowClear
                    disabled={disabled}
                />
            )
        }
        else if (column.type === 'textarea' && (this.props.title === '编辑' || this.props.title === '新增')) {
            return (
                <TextArea
                    disabled={disabled}
                    allowClear
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请输入" + column.title) : ''}
                    rows={4}
                />
            )
        }
        else if (column.type === 'icon') {
            const value = this.props.formDefaultValues?.[column.dataIndex]
            return (
                <Icons value={value} disabled={disabled} />
            )
        }
        else if (column.type === 'number') {
            return (
                <InputNumber
                    style={{ width: '100%' }}
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请选择" + column.title) : ''}
                    disabled={disabled}
                    onPressEnter={() => { this.props.title === '搜索' && this.props.submit && this.props.submit() }}
                />
            )
        }
        else if (column.type === 'multipleTree') {
            const treeData = this.props.dict && this.props.dict[column.dataIndex]
            const values = this.props.formDefaultValues?.[column.dataIndex]
            if (this.props.title === "详情") {
                const show = () => {
                    this.props.nodes.crudTableRef.showTree(values, column)
                }
                return (
                    <Button type="link" onClick={show}>查看</Button>
                )
            } else {
                return (
                    <CrudMultipleTree
                        defaultValues={values}
                        treeData={treeData}
                        title={column.title}
                        searchAble
                        disabled={disabled}
                    />
                )
            }
        }
        else if (column.type === 'tree') {
            return (
                <TreeSelect
                    dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                    disabled={disabled}
                    allowClear
                    treeData={this.treeDataMap(this.props.dict[column.dataIndex])}
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请选择" + column.title) : ''}
                />
            )
        }
        else if (column.type === 'checkbox') {
            const options = this.props.dict && this.props.dict[column.dataIndex]
            const values = this.props.formDefaultValues?.[column.dataIndex]
            if (this.props.title === "详情") {
                const show = () => {
                    this.props.nodes.crudTableRef.showCheckBox(values, column)
                }
                return (
                    <Button type="link" onClick={show}>查看</Button>
                )
            }
            else {
                return (
                    <CrudCheckbox
                        disabled={disabled}
                        options={options}
                        defaultValues={values}
                        title={column.title}
                    />
                )
            }
        }
        else if (column.type === 'switch') {
            return (
                <Switch disabled={disabled} />
            )
        }
        else {
            return (
                <Input
                    placeholder={this.props.title !== '详情' ? (column.placeholder || "请输入" + column.title) : ''}
                    allowClear
                    disabled={disabled}
                    onPressEnter={() => { this.props.title === '搜索' && this.props.submit && this.props.submit() }}
                />
            )
        }
    }


    getFields = () => {
        const children = [];
        for (let i = 0; i < this.props.columns.length; i++) {
            const column = this.props.columns[i]
            if (column.addShow === false && this.props.title === '新增') {
                continue
            }
            if (this.props.title === '搜索') {
                if (column.search === false
                    || column.type === 'icon'
                    || column.type === 'multipleTree'
                    || column.type === 'checkbox') {
                    continue
                }
            }
            if (column.editShow === false && this.props.title === '编辑') {
                continue
            }
            if (column.detailShow === false && this.props.title === '详情') {
                continue
            }
            children.push(
                <Col span={this.props.title === '搜索' ? column.span || 8 : 12} key={i}>
                    <Form.Item
                        valuePropName={column.type === 'switch' ? "checked" : void 0}
                        label={column.title}
                        name={column.dataIndex}
                        rules={this.props.title !== '搜索' && [
                            {
                                required: column.required
                            }
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
            if (formValue[column.dataIndex] === void 0) {
                continue
            }
            if ((column.type === 'date' || column.type === 'datetime') && column.range && this.props.title === '搜索') {
                formValue[column.dataIndex] = formValue[column.dataIndex]?.map(item => item.format("YYYY-MM-DD"))
            }
            else if (column.type === "date") {
                formValue[column.dataIndex] = formValue[key].format("YYYY-MM-DD")
            }
            else if (column.type === 'datetime') {
                const datetime = moment(formValue[column.dataIndex]).format("YYYY-MM-DD HH:mm:ss")
                formValue[column.dataIndex] = datetime === "Invalid date" ? null : datetime
            }
            else if (column.type === 'switch') {
                const columnDict = this.props.dict && this.props.dict[column.dataIndex]
                if (columnDict) {
                    formValue[column.dataIndex] = formValue[column.dataIndex] ? columnDict[0].value : columnDict[1].value
                }
            }
        }
        // 编辑时，有些字段虽然不被编辑，但是仍需要返回其初始值
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
                className={`ant-advanced-search-form crud-form ${this.props.title === '详情' ? 'detail' : ""}`}
                ref={ref => this.formRef = ref}
            >
                <Row gutter={24}>{this.getFields()}</Row>
            </Form>
        );
    }
};

export default CrudForm