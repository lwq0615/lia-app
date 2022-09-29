import React from "react";
import { Button, Tooltip, Badge, Modal } from 'antd';
import * as icons from '@ant-design/icons'
import { wsOpen, wsClose } from './websocket';
import PersonList from './PersonList'

export default class Message extends React.Component {
    state = {
        // 未读消息数
        msgCount: 0,
        // 显示消息弹窗
        visible: false
    }

    componentDidMount = () => {
        wsOpen()
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
                    <section style={{height: 500, display: "flex"}}>
                        <PersonList/>
                    </section>
                </Modal>
            </>
        )
    }

}