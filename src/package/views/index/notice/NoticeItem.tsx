import { List, Tag, Space } from "antd"
import modal from "@/package/components/modal/Modal"
import { marked } from "marked"
import { useEffect, useState } from "react"
import { getFilesOfNotice } from "@/package/request/index/notice"
import ReactDOM from 'react-dom'
import { getFileUrl } from "@/package/request/system/file"
import { getUserDetail } from "@/package/request/system/user"
import moment from 'moment'


export interface Notice {
  id: number,
  title: string,
  content?: string,
  topFlag: string,
  level: string,
  delFlag: string,
  creater: number,
  createTime: string,
  updateTime: string
}


/**
 * 公告发布信息
 */
function CreateInfo(props: {
  creater: any,
  notice: Notice
}) {
  return (
    <div className="notice-item-create-info">
      <Space size="large">
        <span>
          <span>发布人：</span><Tag>{props.creater.companyName + "-" + props.creater.roleName}</Tag>{props.creater.nick}
        </span>
        <span>
          <span>发布时间：</span>{props.notice.createTime}
        </span>
      </Space>
    </div>
  )
}


/**
 * 附件列表
 */
function FileLinks(props: any) {
  const [open, setOpen] = useState<boolean>(false)
  if (!Array.isArray(props.fileList) || !props.fileList.length) {
    return null
  }
  const list = [...props.fileList]
  const first = list.pop()
  return (
    <div className="notice-detail-file-list">
      {list.length ?
        <a className="open-icon" onClick={() => setOpen(!open)}>
          {open ? '收起' : '展开'}
        </a> : null
      }
      <li className="file-item" key={first.fileId}>
        <a style={{ display: 'inline' }} href={getFileUrl(first.fileId)}>
          [附件]&nbsp;{first.name}
        </a>
      </li>
      {open && list.map((file: any) => {
        return (
          <li className="file-item" key={file.fileId}>
            <a key={file.fileId} href={getFileUrl(file.fileId)}>[附件]&nbsp;{file.name}</a>
          </li>
        )
      })}
    </div>
  )
}


export default function NoticeItem(props: {
  levelOption: any[],
  item: Notice
}) {

  const [markRef, setMarkRef] = useState<any>()
  const [fileListRef, setFileListRef] = useState<any>()
  const [fileList, setFileList] = useState<any[]>()
  const [createrRef, setCreaterRef] = useState<any>()
  const [creater, setCreater] = useState<any>()

  /**
   * 渲染markdown
   */
  useEffect(() => {
    if (markRef) {
      markRef.innerHTML = marked.parse(props.item.content || '')
    }
  }, [markRef])

  /**
   * 渲染附件列表
   */
  useEffect(() => {
    fileListRef && fileList && ReactDOM.render(<FileLinks fileList={fileList} />, fileListRef)
  }, [fileListRef, fileList])


  /**
   * 渲染发布者信息
   */
  useEffect(() => {
    creater && createrRef && ReactDOM.render(<CreateInfo creater={creater} notice={props.item} />, createrRef)
  }, [creater, createrRef])

  const showDetail = () => {
    getFilesOfNotice(props.item.id).then(res => {
      setFileList(res as any || []);
    })
    getUserDetail(props.item.creater).then(res => {
      setCreater(res)
    })
    modal({
      title: <span>{getLevelLabel()}{props.item.title}</span>,
      content: (
        <>
          <div ref={ref => setFileListRef(ref)}></div>
          <div ref={ref => setCreaterRef(ref)}></div>
          <div className="markdown-body" ref={ref => setMarkRef(ref)}></div>
        </>
      )
    })
  }

  function getLevelLabel() {
    const levelLabel = props.levelOption.find(option => option.value === props.item.level)?.label
    switch (levelLabel) {
      case "普通":
        return null
      case "重要":
        return (
          <span style={{ color: "#1677ff" }}>[重要]&nbsp;</span>
        )
      case "紧急":
        return (
          <span style={{ color: "#ff4d4f" }}>[紧急]&nbsp;</span>
        )
      default:
        return null
    }
  }

  return (
    <List.Item key={props.item.id} className={props.item.topFlag === '1' ? 'notice-item-top' : ''}>
      <span onClick={() => showDetail()} className="notice--item-title">
        {getLevelLabel()}
        {props.item.title}
      </span>
      <div className="notice--item-time">{moment(props.item.createTime).fromNow().replace(/ /g, "")}</div>
    </List.Item>
  )

}