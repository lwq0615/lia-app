import Publish from "./Publish"
import './notice.scss'
import useHasAuth from "@/package/hook/hasAuth"
import { List, Pagination, PaginationProps } from 'antd';
import { getSysNoticePage } from "@/package/request/index/notice";
import { useEffect, useState } from "react";
import { getDictByKey } from "@/package/request/system/dictData";
import NoticeItem, { Notice } from "./NoticeItem";

export default function NoticeComp() {

  const canPubilsh = useHasAuth("system:notice:add")
  const [list, setList] = useState<Notice[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [levelOption, setLevelOption] = useState<any[]>([])

  useEffect(() => {
    getSysNoticePage({}, current, 10).then((res: any) => {
      setList(res.list as unknown as Notice[]);
      setTotal(res.total)
    })
    // 公告等级字典
    getDictByKey('sys:notice:level').then((res: any) => {
      setLevelOption(res);
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
            {canPubilsh && <Publish/>}
          </h3>
        }
        bordered
        dataSource={list}
        renderItem={(item) => (<NoticeItem item={item} levelOption={levelOption}/>)}
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