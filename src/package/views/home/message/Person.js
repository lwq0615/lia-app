
import { http } from "@/config"
import propTypes from 'prop-types'
import { Badge } from 'antd';
import defaultImg from '../image/default.jpg'

export function getHeadImg(item){
    if(item.remark){
        return http.baseUrl+"/system/file/getPic?comp=true&path="+item.remark
    }else{
        return defaultImg
    }
}

export default function Person(props){

    return (
        <section className={`person-item ${props.active ? "active" : ''}`} onClick={() => props.onClick(props.item)}>
            <Badge count={props.item.noReadCount} size="small">
                <img className='head-img' src={getHeadImg(props.item)}/>
            </Badge>
            <div style={{paddingLeft: 10, flex: 1, overflow: "hidden"}}>
                <p className='name'>({props.roleMap[props.item.roleId]}) {props.item.nick}</p>
                <p className='lastMsg'>{props.item.lastMsg}</p>
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