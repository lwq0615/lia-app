import { Tag } from 'antd'
import React from 'react'
import { withAliveScope } from 'react-activation'

interface Router {
    keyPath: string,
    label: string | null,
    element: string | null
}

class HistoryRouter extends React.Component{

    state:{ 
        historyRouterList:Router[],
        activeRouter: string | null
    } = {
        // 被缓存的路由
        historyRouterList: [],
        activeRouter: null
    }

    /**
     * 添加历史路由
     */
    addHistory = (router:Router) => {
        this.setState({
            activeRouter: router.keyPath
        })
        for(let item of this.state.historyRouterList){
            if(item.keyPath === router.keyPath){
                return
            }
        }
        this.state.historyRouterList.push(router)
        this.setState({
            historyRouterList: this.state.historyRouterList
        })
    }

    /**
     * 删除历史路由
     */
    removeHistory = (router: Router) => {
        const props:any = this.props
        props.dropScope(router.element)
        const index = this.state.historyRouterList.indexOf(router)
        this.state.historyRouterList.splice(index, 1)
        // 关闭了当前页面，跳转历史路由列表的最后一个路由
        if(router.keyPath === this.state.activeRouter){
            props.goRouter(this.state.historyRouterList.slice(-1)[0]?.keyPath?.split(","))
        }
    }


    /**
     * 路由跳转
     */
    goRouter = (router: Router) => {
        this.setState({
            activeRouter: router.keyPath
        })
        const props:any = this.props
        props.goRouter(router.keyPath !== '' ? router.keyPath.split(",") : [])
    }

    render(){
        return (
            <div className='history-router'>
                {
                    this.state.historyRouterList?.map((item:Router) => (
                        <Tag 
                            color={this.state.activeRouter === item.keyPath ? '#108ee9' : undefined}
                            closable 
                            key={item.keyPath}
                            onClick={() => this.goRouter(item)}
                            onClose={() => this.removeHistory(item)}
                        >{item.label}</Tag>
                    ))
                }
            </div>
        )
    }
}

export default withAliveScope(HistoryRouter)