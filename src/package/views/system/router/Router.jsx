
import React from "react"
import RouterTree from "./RouterTree"
import RouterForm from "./RouterForm"
import moment from 'moment';
import { getSysRouterTree, getRouterById } from '@/package/request/system/router'
import { getCreateByDict } from '@/package/request/system/user'



class Router extends React.Component {

    state = {
        // 左侧路由树数据
        routerTreeData: [],
        // 父路由字段数据
        routerDict: [],
        // 创建人字段数据
        userDict: [],
        // 表单值
        form: null,
        // 表单标题
        formTitle: '新增',
        // 当前选中的路由
        routerId: null
    }

    componentDidMount = async () => {
        this.setState({
            routerTreeData: (await getSysRouterTree())[0].children,
            routerDict: await getSysRouterTree(),
            userDict: await getCreateByDict()
        })
        this.setForm()
    }

    reloadTree = async () => {
        this.setState({
            routerDict: await getSysRouterTree(),
            routerTreeData:(await getSysRouterTree())[0].children
        })
    }

    onTreeSelect = (key, keys) => {
        getRouterById(key).then(res => {
            this.setForm(res, res.label, res.routerId)
        })
    }

    setForm = (form, title, id) => {
        // 各个字段
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
            this.setState({
                form: formValue,
                formTitle: title,
                routerId: id
            })
        } else {
            formValue = keys.map(key => {
                if (key === 'parent') {
                    return {
                        name: [key],
                        value: this.state.routerId || 1
                    }
                }
                return {
                    name: [key],
                    value: undefined
                }
            })
            this.setState({
                form: formValue,
                formTitle: "新增",
                routerId: null
            })
        }
    }

    render() {
        return (
            <section className="system-router">
                <RouterTree
                    onSelect={this.onTreeSelect}
                    addClick={this.setForm}
                    routerTree={this.state.routerTreeData}
                    addButton
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