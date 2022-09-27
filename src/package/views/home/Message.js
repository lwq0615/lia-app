import React from "react";
import { Button, Tooltip, Badge, Modal } from 'antd';
import * as icons from '@ant-design/icons'
import { wsOpen } from './websocket';

export default class Message extends React.Component {

    state = {
        msgCount: 0,
        visible: false
    }

    componentDidMount = () => {
        wsOpen()
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
                    footer={null}
                    onCancel={() => this.setState({visible: false})}
                >
                    <section style={{height: 500}}>
                        
                    </section>
                </Modal>
            </>
        )
    }

}