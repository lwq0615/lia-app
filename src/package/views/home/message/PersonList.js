import React from 'react';
import { getPersonList, getNoReadCount, getLastMsg } from '@/package/request/system/message'
import { getRoleDict } from '@/package/request/system/role'
import Person from './Person';

export default class PersonList extends React.Component {

    state = {
        // 聊天用户列表
        personList: [],
        roleMap: {},
        // 当前聊天用户
        nowPerson: null
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
                for(let person of personList){
                    person.noReadCount = countMap[person.userId] || 0
                    person.lastMsg = lastMsgMap[person.userId]
                }
                this.setState({
                    personList: personList
                })
            })
        })
    }

    onClick = (item) => {
        this.setState({
            nowPerson: item.userId
        })
    }

    render() {
        return (
            <div style={{backgroundColor: 'whitesmoke'}}>
                {this.state.personList.map(item => (
                    <Person 
                        active={this.state.nowPerson === item.userId}
                        item={item}
                        key={item.userId} 
                        roleMap={this.state.roleMap}
                        onClick={this.onClick}/>
                    )  
                )}
            </div>
        )
    }

}