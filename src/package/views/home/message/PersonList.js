import React from 'react';
import { getPersonList, getNoReadCount, getLastMsg, readMessage } from '@/package/request/system/message'
import { getRoleDict } from '@/package/request/system/role'
import Person from './Person';

export default class PersonList extends React.Component {

    state = {
        // 聊天用户列表
        personList: [],
        roleMap: {}
    }

    componentDidMount = () => {
        // 获取角色字典映射表
        getRoleDict().then(res => {
            res.forEach(item => {
                this.state.roleMap[item.value] = item.label
            })
            this.setState({
                roleMap: this.state.roleMap
            })
        })
        //获取聊天列表数据
        Promise.all([getPersonList(), getNoReadCount()]).then(([personList, countMap]) => {
            getLastMsg(personList.map(item => item.userId)).then(lastMsgMap => {
                for (let person of personList) {
                    person.noReadCount = countMap[person.userId] || 0
                    person.lastMsg = lastMsgMap[person.userId]
                }
                this.setState({
                    personList: personList
                })
            })
        })
    }

    /**
     * 收到新消息时未读+1
     */
    onMessage = (msg) => {
        // 对方ID
        const personId = msg.sendBy === this.props.userInfo?.userId ? msg.sendTo : msg.sendBy
        this.setState({
            personList: this.state.personList.map(person => {
                if (person.userId === personId) {
                    if (this.props.nowPerson?.userId !== person.userId ) {
                        person.noReadCount++
                    }
                    person.lastMsg = msg.content
                }
                return person
            })
        })
    }

    //点击列表联系人
    onClick = (item) => {
        if (this.props.nowPerson?.userId === item.userId) {
            return
        }
        this.setState({
            personList: this.state.personList.map(person => {
                if (person.userId === item.userId) {
                    this.props.setMsgCount(-person.noReadCount)
                    person.noReadCount = 0
                }
                return person
            })
        })
        this.props.setPerson(item)
        readMessage({
            sendBy: item.userId,
            sendTo: this.props.userInfo.userId
        })
    }

    render() {
        return (
            <div style={{ backgroundColor: '#ffffff' }}>
                {this.state.personList.map(item => (
                    <Person
                        active={this.props.nowPerson?.userId === item.userId}
                        item={item}
                        key={item.userId}
                        roleMap={this.state.roleMap}
                        onClick={this.onClick} />
                )
                )}
            </div>
        )
    }

}