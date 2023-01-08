import React from 'react';
import { getPersonList, getNoReadCount, getLastMsg, readMessage } from '@/package/request/system/message'
import { getRoleDict } from '@/package/request/system/role'
import Person from './Person';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons'

export default class PersonList extends React.Component {

    state = {
        // 搜索后的聊天用户列表
        personList: [],
        roleMap: {}
    }
    // 所有的用户列表
    allPersonList = []

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
                const listData = []
                for (let person of personList) {
                    person.noReadCount = countMap[person.userId] || 0
                    person.lastMsg = lastMsgMap[person.userId]
                    if (person.noReadCount > 0) {
                        listData.splice(0, 0, person)
                    } else {
                        listData.push(person)
                    }
                }
                this.allPersonList = listData
                this.setState({
                    personList: listData
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
        const newPersonList = []
        this.state.personList.forEach(person => {
            if (person.userId === personId) {
                if (this.props.nowPerson?.userId !== person.userId) {
                    person.noReadCount++
                }
                person.lastMsg = msg.content
                newPersonList.splice(0, 0, person)
            } else {
                newPersonList.push(person)
            }
        })
        this.setState({
            personList: newPersonList
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

    /**
     * 搜索联系人
     */
    search = (e) => {
        const name = e.target.value
        const noReadList = []
        const readList = []
        this.allPersonList.forEach(item => {
            if(!item.nick.includes(name)) {
                return
            }
            if(item.noReadCount > 0){
                noReadList.push(item)
            }else{
                readList.push(item)
            }
        })
        this.setState({
            personList: noReadList.concat(readList)
        })
    }

    render() {
        return (
            <div style={{ backgroundColor: '#ffffff', width: 250 }}>
                <Input allowClear prefix={<SearchOutlined />} onChange={this.search} placeholder="搜索"/>
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