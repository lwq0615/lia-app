import React from "react";
import { Button, Tooltip, Badge, Modal } from 'antd';
import * as icons from '@ant-design/icons'
import { wsOpen, wsClose } from './websocket';
import { getNoReadCount } from '@/package/request/system/message'
import PersonList from './PersonList'
import MsgBox from './MsgBox'
import './message.scss'

export default class Message extends React.Component {
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
            // 收到消息时
            const msg = JSON.parse(e.data)
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
            this.setMsgCount(eval(Object.values(res).join("+")) || 0)
        })
    }


    componentWillUnmount = () => {
        wsClose()
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
                            onClick={() => this.setState({visible: true})}
                        />
                    </Badge>
                </Tooltip>
                <Modal
                    centered
                    width={1000}
                    keyboard
                    title="消息通知"
                    visible={this.state.visible}
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
                            userHeadImg={this.props.userHeadImg}
                            person={this.state.nowPerson}
                            ref={ref => this.msgBoxNode = ref}
                        />
                    </section>
                </Modal>
            </>
        )
    }

}