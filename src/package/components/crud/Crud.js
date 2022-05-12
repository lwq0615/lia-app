import CrudTable from './CrudTable'
import CrudSearch from './CurdSerach'
import CrudMenu from './CurdMenu'
import React from 'react'
import propTypes from 'prop-types'


class Crud extends React.Component {

    static propTypes = {
        getPage: propTypes.func.isRequired,
        columns: propTypes.array.isRequired,
        selection: propTypes.func,
        onRowClick: propTypes.func,
        editClick: propTypes.func,
        deleteClick: propTypes.func,
        addClick: propTypes.func,
        onSearch: propTypes.func,
        onSubmit: propTypes.func
    }

    nodes = {}

    render() {
        return (
            <section>
                <CrudSearch
                    columns={this.props.columns}
                    getPage={this.props.getPage}
                    ref={ref => this.nodes.crudSearchRef = ref}
                    nodes={this.nodes}
                />
                <CrudMenu
                    onSubmit={this.props.onSubmit}
                    nodes={this.nodes}
                    columns={this.props.columns} 
                    addClick={this.props.addClick}
                />
                <CrudTable
                    {...this.props}
                    ref={ref => this.nodes.crudTableRef = ref}
                    nodes={this.nodes}
                />
            </section>
        )
    }

}

export default Crud