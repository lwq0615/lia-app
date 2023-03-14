import CrudTable from './CrudTable'
import CrudSearch from './CurdSerach'
import CrudMenu from './CurdMenu'
import React from 'react'
import propTypes from 'prop-types'
import './crud.scss'
import { Spin } from 'antd'


class Crud extends React.Component {

    static propTypes = {
        getPage: propTypes.func.isRequired,
        onSave: propTypes.func,
        onDelete: propTypes.func,
        columns: propTypes.array.isRequired,
        selection: propTypes.bool,
        showIndex: propTypes.bool,
        rightAction: propTypes.oneOfType([propTypes.array, propTypes.bool]),
        onSelection: propTypes.func,
        onRowClick: propTypes.func,
        editClick: propTypes.func,
        deleteClick: propTypes.func,
        addClick: propTypes.func,
        showSearch: propTypes.bool,
        menuBtns: propTypes.oneOfType([propTypes.array, propTypes.bool]),
        deleteMsg: propTypes.string,
        style: propTypes.object
    }

    static defaultProps = {
        selection: true,
        showIndex: true,
        rightAction: ["detail", "edit", "delete"],
        showSearch: true,
        menuBtns: ["add", "delete", "search"]
    }

    state = {
        dict: {},
        // 数据字典是否加载完成
        dictLoadEd: false
    }

    nodes = {}

    refreshPage = () => {
        this.nodes.crudTableRef?.getPage()
    }

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
            dict: newDict,
            dictLoadEd: true
        })
    }

    render() {
        return (
            <section className={this.props.className ? this.props.className + " lia-crud" : "lia-crud"} style={this.props.style}>
                <Spin spinning={!this.state.dictLoadEd}>
                    {
                        this.state.dictLoadEd &&
                        <div>
                            {
                                !this.props.showSearch
                                    ? null
                                    : (
                                        <CrudSearch
                                            {...this.props}
                                            ref={ref => this.nodes.crudSearchRef = ref}
                                            nodes={this.nodes}
                                            dict={this.state.dict}
                                        />
                                    )
                            }
                            {
                                !this.props.menuBtns
                                    ? null
                                    : (
                                        <CrudMenu
                                            {...this.props}
                                            nodes={this.nodes}
                                            dict={this.state.dict}
                                        />
                                    )
                            }
                            <CrudTable
                                {...this.props}
                                ref={ref => this.nodes.crudTableRef = ref}
                                nodes={this.nodes}
                                dict={this.state.dict}
                            />
                        </div>
                    }
                </Spin>
            </section>
        )
    }

}

export default Crud