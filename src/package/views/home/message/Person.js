import './person.scss'
import { http } from "@/config"
import propTypes from 'prop-types'
import { Badge } from 'antd';
import defaultImg from '../image/default.jpg'

function getHeadImg(item){
    if(item.remark){
        return http.baseUrl+"/system/file/getPic?comp=true&path="+item.remark
    }else{
        return defaultImg
    }
}

export default function Person(props){

    function getMsgText(lastMsg){
        if(!lastMsg){
            return
        }
        if(lastMsg.sendBy === null){
            return "我: "+ lastMsg.content
        }else{
            return props.item.nick +": "+ lastMsg.content
        }
    }

    return (
        <section className={`person-item ${props.active ? "active" : ''}`} onClick={() => props.onClick(props.item)}>
            <Badge count={props.item.noReadCount} size="small">
                <img className='head-img' src={getHeadImg(props.item)}/>
            </Badge>
            <div style={{paddingLeft: 10, flex: 1, overflow: "hidden"}}>
                <p className='name'>({props.roleMap[props.item.roleId]}) {props.item.nick}</p>
                <p className='lastMsg'>{getMsgText(props.item.lastMsg)}</p>
            </div>
        </section>
    )
}

Person.propTypes = {
    item: propTypes.object,
    roleMap: propTypes.object,
    onClick: propTypes.func,
    active: propTypes.bool
}