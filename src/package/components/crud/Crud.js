import CrudTable from './CrudTable'
import CrudSearch from './CurdSerach'
import CrudMenu from './CurdMenu'
import React from 'react'
import propTypes from 'prop-types'
import './crud.scss'


class Crud extends React.Component {

    static propTypes = {
        getPage: propTypes.func.isRequired,
        columns: propTypes.array.isRequired,
        selection: propTypes.bool,
        onSelection: propTypes.func,
        onRowClick: propTypes.func,
        editClick: propTypes.func,
        deleteClick: propTypes.func,
        addClick: propTypes.func,
        onSearch: propTypes.func,
        onSave: propTypes.func
    }

    state = {
        dict: {}
    }

    nodes = {}

    componentDidMount = async () => {
        const newDict = {}
        for (let column of this.props.columns) {
            try {
                if (column.dict) {
                    let dict = null
                    if (typeof column.dict === 'function') {
                        dict = await column.dict()
                    } else {
                        dict = column.dict
                    }
                    newDict[column.dataIndex] = dict
                }
            } catch (err) {
                console.error(err)
                continue
            }
        }
        this.setState({
            dict: newDict
        })
    }

    render() {
        return (
            <section className='lia-crud'>
                {
                    this.props.justShowTable
                        ? null
                        :(<>
                            <CrudSearch
                                {...this.props}
                                ref={ref => this.nodes.crudSearchRef = ref}
                                nodes={this.nodes}
                                dict={this.state.dict}
                            />
                            <CrudMenu
                                {...this.props}
                                nodes={this.nodes}
                                dict={this.state.dict}
                            />
                        </>)
                }
                <CrudTable
                    {...this.props}
                    ref={ref => this.nodes.crudTableRef = ref}
                    nodes={this.nodes}
                    dict={this.state.dict}
                />
            </section>
        )
    }

}

export default Crud