
import React from 'react';
import CrudForm from './CrudForm';

class CrudSearch extends React.Component {

    params = {}

    search = () => {
        this.props.nodes.crudTableRef.getPage()
    }

    getParams = async () => {
        return await this.searchFormRef.getFormValue() || {}
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