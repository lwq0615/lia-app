import Publish from "./Publish"
import './notice.scss'
import useHasAuth from "@/package/hook/hasAuth"
import { List, Pagination, PaginationProps } from 'antd';
import { getSysNoticePage } from "@/package/request/index/notice";
import { useEffect, useState } from "react";

interface Notice {
  id: number,
  title: string,
  content?: string,
  topFlag: string,
  level: string,
  delFlag: string,
  createBy: number,
  createTime: string,
  updateTime: string
}

export default function Notice() {

  const canPubilsh = useHasAuth("system:notice:add")
  const [list, setList] = useState<Notice[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    getSysNoticePage({}, current, 10).then((res: any) => {
      setList(res.list as unknown as Notice[]);
      setTotal(res.total)
    })
  }, [current])

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    setCurrent(pageNumber)
  };

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
        dataSource={list}
        renderItem={(item) => (<List.Item>
          <span>{item.title}</span>
        </List.Item>)}
      />
      <Pagination
        size="small"
        defaultCurrent={1}
        total={total}
        showSizeChanger={false}
        current={current}
        onChange={onChange}
      />
    </div>
  )
}