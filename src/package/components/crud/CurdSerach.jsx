
import React from 'react';
import CrudForm from './CrudForm';

class CrudSearch extends React.Component {

    params = {}

    search = () => {
        this.props.nodes.crudTableRef.getPage()
    }

    getParams = async () => {
        const params = await this.searchFormRef.getFormValue() || {}
        // 开关默认有一个关闭值
        for (let column of this.props.columns) {
            if(column.type === 'switch' && params[column.dataIndex] === void 0){
                const columnDict = this.props.dict[column.dataIndex]
                if(columnDict && columnDict[1]){
                    params[column.dataIndex] = columnDict && columnDict[1].value
                }else{
                    params[column.dataIndex] = false
                }
            }
        }
        return params
    }

    render() {
        return (
            <CrudForm
                columns={this.props.columns}
                title='搜索'
                ref={ref => this.searchFormRef = ref}
                submit={this.search}
                dict={this.props.dict}
            />
        )
    }

}

export default CrudSearch