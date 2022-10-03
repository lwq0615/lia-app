import React from "react";
import { getMsgRecordPage, readMessage } from '@/package/request/system/message'
import propTypes from 'prop-types'
import { http } from "@/config"
import { getHeadImg } from './Person'
import { wsSend } from "./websocket";

export default class MsgBox extends React.Component {

    static propTypes = {
        userInfo: propTypes.object,
        person: propTypes.object
    }

    state = {
        msgList: null,
        over: false
    }

    // 为true时每次聊天列表变化都会自动滚动到底部
    scrollToEnd = true
    current = 1
    size = 10
    total = null
    //触顶刷新时与底部的距离，保证刷新后位置不变
    scrollBottom = null
    //聊天记录全部获取完成
    msgListDom = null
    msgInputDom = null

    /**
     * 获取聊天记录分页数据
     */
    loadMsgList = (params) => {
        //已经全部获取完成
        if (this.total === 0 || this.total && (this.current - 1) * this.size >= this.total) {
            this.setState({
                over: true
            })
            return false
        }
        getMsgRecordPage(params, this.current++, this.size).then(async res => {
            this.total = res.total
            this.setState({
                msgList: res.list.reverse().concat(this.state.msgList || [])
            })
        })
    }

    // 点击联系人时重新加载
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.userInfo || !nextProps.person) {
            return
        }
        if (nextProps.person.userId !== this.props.person?.userId) {
            const params = {
                sendBy: this.props.userInfo.userId,
                sendTo: nextProps.person.userId
            }
            // 重置分页信息
            this.state.msgList = null
            this.current = 1
            this.total = null
            this.scrollToEnd = true
            this.state.over = false
            this.loadMsgList(params)
        }
    }


    componentDidUpdate = () => {
        const msgList = this.msgListDom
        //列表重新渲染时滚动条置底
        if (this.scrollToEnd) {
            msgList.children[msgList.children.length - 1]?.scrollIntoView(false)
        }
        //触顶刷新后不改变位置
        if (this.scrollBottom) {
            msgList.scrollTop = msgList.scrollHeight - msgList.clientHeight - this.scrollBottom
            this.scrollBottom = null
        }
        if (!this.props.person) {
            return
        }
        // 刚点击联系人时虽然还没有获取聊天记录进行渲染，但是也会先执行一次componentDidUpdate
        // 再执行componentDidMount时会导致loadMsgList方法执行了2次导致数据错乱
        // 所以在这里判断如果是点击联系人导致的componentDidUpdate事件不执行loadMsgList方法
        if (!this.state.msgList) {
            return
        }
        //聊天数据已经获取完了
        if (this.state.over) {
            return
        }
        // 如果获取的聊天记录不足以铺满一页(没有出现滚动条)，则额外再获取一页数据
        if (msgList.scrollHeight <= msgList.clientHeight) {
            const params = {
                sendBy: this.props.userInfo.userId,
                sendTo: this.props.person.userId
            }
            this.loadMsgList(params)
        }
    }

    componentDidMount = () => {
        const dom = this.msgListDom
        dom.onscroll = () => {
            const clientHeight = dom.clientHeight;
            const scrollTop = dom.scrollTop;
            const scrollHeight = dom.scrollHeight;
            this.scrollToEnd = scrollHeight - clientHeight - scrollTop < 1
            //触顶，获取更早的聊天记录
            if (!this.state.over && scrollTop === 0) {
                this.scrollBottom = scrollHeight - clientHeight
                const params = {
                    sendBy: this.props.userInfo.userId,
                    sendTo: this.props.person.userId
                }
                this.loadMsgList(params)
            }
        }
    }

    /**
     * 生成聊天记录列表视图
     */
    createMsgList = (list) => {
        if (!Array.isArray(list)) {
            return
        }
        const view = []
        for(let i in list){
            const item = list[i]
            if (item.sendBy === this.props.userInfo.userId) {
                view.push(
                    <div key={i} className="right">
                        <p>{item.content}</p>
                        <img className="headImg" src={getHeadImg(this.props.userHeadImg)} />
                    </div>
                )
            } else {
                view.push(
                    <div key={i} className="left">
                        <img className="headImg" src={getHeadImg(item)} />
                        <p>{item.content}</p>
                    </div>
                )
            }
        }
        return view
    }


    /**
     * 收到消息并且正处于该聊天界面时更新列表并更改消息状态为已读
     */
    onMessage = (msg) => {
        this.setState({
            msgList: this.state.msgList.concat(msg)
        })
        if(msg.sendTo === this.props.userInfo.userId){
            readMessage({
                sendBy: this.props.person.userId,
                sendTo: this.props.userInfo.userId
            })
        }
    }

    /**
     * 回车键发送消息
     */
    sendMessage = (e) => {
        if (e.charCode !== 13) return
        e.preventDefault()
        const input = this.msgInputDom
        if(!input.value) return
        // 通过websocket发送消息
        const message = {
            content: input.value,
            type: '0',
            sendBy: this.props.userInfo?.userId,
            sendTo: this.props.person?.userId
        }
        //清空输入框
        input.value = null
        wsSend(message)
    }

    render() {
        return (
            <section className="msgbox-container">
                <div className="msg-list" id="msgList" ref={ref => this.msgListDom = ref}>
                    {this.state.over && "暂无更多消息"}
                    {this.createMsgList(this.state.msgList)}
                </div>
                <div className="menu"></div>
                <textarea
                    className="msg-input"
                    disabled={!Boolean(this.props.person)}
                    ref={ref => this.msgInputDom = ref}
                    onKeyPress={this.sendMessage}
                />
            </section>
        )
    }

}