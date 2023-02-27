import Publish from "./Publish"
import './notice.scss'
import useHasAuth from "@/package/hook/hasAuth"
import { List } from 'antd';
import { getSysNoticePage } from "@/package/request/index/notice";
import { useEffect } from "react";


const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default function Notice() {

  const canPubilsh = useHasAuth("system:notice:add")

  useEffect(() => {
    getSysNoticePage({}, 1, 10).then(res => {
      console.log(res);
    })
  }, [])

  return (
    <div className="index-notice card">
      <List
        size="small"
        header={
          <h3 className='title'>
            通知/公告
            {canPubilsh && <Publish />}
          </h3>
        }
        bordered
        dataSource={data}
        renderItem={(item) => (<List.Item>
          <span>{item}</span>
        </List.Item>)}
      />
    </div>
  )
}