import React from "react";
import { Button, Tooltip, Badge, Modal, message } from 'antd';
import * as icons from '@ant-design/icons'
import { wsOpen, wsClose } from './websocket';
import { getNoReadCount, readMessage } from '@/package/request/system/message'
import PersonList from './PersonList'
import MsgBox from './MsgBox'
import './message.scss'
import WithRouter from '@/package/components/hoc/WithRouter';

class Message extends React.Component {
    state = {
        // 未读消息数
        msgCount: 0,
        // 显示消息弹窗
        visible: false,
        // 当前聊天用户
        nowPerson: null
    }
    msgBoxNode = null
    personListNode = null

    setPerson = (person) => {
        this.setState({
            nowPerson: person
        })
    }

    setMsgCount = (count) => {
        let msgCount = this.state.msgCount + count
        if(msgCount < 0){
            msgCount = 0
        }
        this.setState({
            msgCount: msgCount
        })
    }

    componentDidMount = () => {
        wsOpen((e) => {
            const httpResult = JSON.parse(e.data)
            // 收到消息时
            if(httpResult.code !== 200){
                message.warning(httpResult.message)
                localStorage.removeItem(process.env.REACT_APP_HTTP_HEADER)
                this.props.navigate("/login")
                return
            }
            const msg = httpResult.data
            // 如果用户正处于聊天界面，则更新聊天记录列表
            if(this.state.visible && [msg.sendBy, msg.sendTo].includes(this.state.nowPerson?.userId)){
                this.msgBoxNode?.onMessage(msg)
            }else{
                // 更新首页消息按钮未读数
                this.setMsgCount(1)
            }
            // 更新联系人列表未读数和最新消息
            if(this.personListNode){
                this.personListNode?.onMessage(msg)
            }
        })
        getNoReadCount().then(res => {
            this.setMsgCount(eval(Object.values(res || {}).join("+")) || 0)
        })
    }


    componentWillUnmount = () => {
        wsClose()
    }

    /**
     * 点击消息按钮
     */
    openMsgBox = () => {
        this.setState({visible: true})
        if(this.state.nowPerson){
            // 当前聊天的联系人消息设置为已读
            readMessage({
                sendBy: this.state.nowPerson.userId,
                sendTo: this.props.userInfo.userId
            }).then(res => {
                this.setMsgCount(-res)
            })
        }
    }

    render() {
        return (
            <>
                <Tooltip title="消息通知">
                    <Badge count={this.state.msgCount}>
                        <Button
                            size='large'
                            type="primary"
                            shape="circle"
                            icon={<icons.MessageOutlined />}
                            onClick={this.openMsgBox}
                        />
                    </Badge>
                </Tooltip>
                <Modal
                    centered
                    width={1000}
                    keyboard
                    title="消息通知"
                    open={this.state.visible}
                    bodyStyle={{padding: 0}}
                    footer={null}
                    onCancel={() => this.setState({visible: false})}
                >
                    <section style={{height: 600, display: "flex"}}>
                        <PersonList 
                            setMsgCount={this.setMsgCount}
                            setPerson={this.setPerson}
                            nowPerson={this.state.nowPerson}
                            userInfo={this.props.userInfo}
                            ref={ref => this.personListNode = ref}
                        />
                        <MsgBox 
                            userInfo={this.props.userInfo}
                            person={this.state.nowPerson}
                            ref={ref => this.msgBoxNode = ref}
                        />
                    </section>
                </Modal>
            </>
        )
    }

}


export default WithRouter(Message)