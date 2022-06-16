
import React from "react"
import RouterTree from "./RouterTree.js"
import RouterForm from "./RouterForm.js"
import moment from 'moment';
import { getSysRouterTree } from '@/package/request/system/router'
import { getUserDict } from '@/package/request/system/dict'



class Router extends React.Component {

    state = {
        routerTreeData: [],
        routerDict: [],
        userDict: [],
        form: null,
        formTitle: '新增',
        routerId: null
    }

    componentDidMount = async () => {
        this.setState({
            routerTreeData: (await getSysRouterTree())[0].children,
            routerDict: await getSysRouterTree(),
            userDict: await getUserDict()
        })
        this.setForm()
    }

    reloadTree = async () => {
        this.setState({
            routerTreeData:(await getSysRouterTree())[0].children
        })
    }

    setForm = (form, title, id) => {
        const keys = ['label', 'path', 'element', 'parent', 'index', 'icon', 'createBy', 'createTime', 'remark']
        let formValue = []
        if (form) {
            formValue = keys.map(key => {
                if (form[key] && key === 'createTime') {
                    return {
                        name: [key],
                        value: moment(form[key]).format("YYYY-MM-DDTHH:mm")
                    }
                }
                return {
                    name: [key],
                    value: form[key]
                }
            })
        } else {
            formValue = keys.map(key => {
                if (key === 'parent') {
                    return {
                        name: [key],
                        value: 0
                    }
                }
                return {
                    name: [key],
                    value: undefined
                }
            })
        }
        this.setState({
            form: formValue,
            formTitle: title || '新增',
            routerId: id
        })
    }

    render() {
        return (
            <section className="system-router">
                <RouterTree
                    setForm={this.setForm}
                    routerTree={this.state.routerTreeData}
                />
                <RouterForm
                    routerId={this.state.routerId}
                    formTitle={this.state.formTitle}
                    routerDict={this.state.routerDict}
                    userDict={this.state.userDict}
                    formValue={this.state.form}
                    reloadTree={this.reloadTree}
                    setForm={this.setForm}
                />
            </section>
        )
    }
}

export default Router