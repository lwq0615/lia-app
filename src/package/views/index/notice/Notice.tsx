import Publish from "./Publish"
import './notice.scss'
import useHasAuth from "@/package/hook/hasAuth"
import { List, Pagination, PaginationProps } from 'antd';
import { getSysNoticePage } from "@/package/request/index/notice";
import { useEffect, useState } from "react";
import { getDictByKey } from "@/package/request/system/dictData";
import NoticeItem, { Notice } from "./NoticeItem";
import { getRoleDict } from "@/package/request/system/role";


export type TreeItem = {
  label: string,
  value: any,
  children?: TreeItem[]
}

/**
 * 获取企业角色树
 */
const getRoleTree = () => {
  const roleTreeDict: TreeItem[] = []
  return getRoleDict().then((res: any) => {
    const companyRoleTree: any = {}
    res.forEach((item: any) => {
      if (!Array.isArray(companyRoleTree[item.remark])) {
        companyRoleTree[item.remark] = []
      }
      companyRoleTree[item.remark].push(item)
    })
    Object.keys(companyRoleTree).forEach(item => {
      roleTreeDict.push({
        label: item,
        value: "company:" + item,
        children: companyRoleTree[item]
      })
    })
    return roleTreeDict
  })
}


export default function NoticeComp() {

  const canPubilsh = useHasAuth("system:notice:add")
  const canEdit = useHasAuth("system:notice:edit")
  const [list, setList] = useState<Notice[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [levelOption, setLevelOption] = useState<any[]>()
  const [roleTree, setRoleTree] = useState<TreeItem[]>()

  const getPage = () => {
    getSysNoticePage({}, current, 10).then((res: any) => {
      setList(res.list as unknown as Notice[]);
      setTotal(res.total)
    })
  }

  useEffect(() => {
    // 公告等级字典
    getDictByKey('sys:notice:level').then((res: any) => {
      setLevelOption(res);
    })
    getRoleTree().then((res: TreeItem[]) => {
      setRoleTree(res)
    })
  }, [])

  useEffect(() => {
    getPage()
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
            {canPubilsh && 
              <Publish onOk={getPage} levelOption={levelOption} roleTree={roleTree}>
                <a style={{ userSelect: 'none' }}>发布</a>
              </Publish>
            }
          </h3>
        }
        bordered
        dataSource={list}
        renderItem={(item) => (<NoticeItem item={item} levelOption={levelOption} roleTree={roleTree} getPage={getPage} canEdit={canEdit}/>)}
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