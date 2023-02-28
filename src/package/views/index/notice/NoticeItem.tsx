import { List } from "antd"
import modal from "@/package/components/modal/Modal"
import { marked } from "marked"
import { useEffect, useState } from "react"
import { getFilesOfNotice } from "@/package/request/index/notice"
import ReactDOM from 'react-dom'
import { getFileUrl } from "@/package/request/system/file"


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
        </a> : null}
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

  const [ref, setRef] = useState<any>()
  const [fileListRef, setFileListRef] = useState<any>()
  const [fileList, setFileList] = useState<any[]>()

  useEffect(() => {
    if (ref && fileList && fileListRef) {
      ReactDOM.render(<FileLinks fileList={fileList} />, fileListRef)
      ref.innerHTML = marked.parse(props.item.content || '')
    }
  }, [ref, fileList, fileListRef])

  const showDetail = () => {
    getFilesOfNotice(props.item.id).then(res => {
      setFileList(res as any || []);
    })
    modal({
      title: <span>{getLevelLabel()}{props.item.title}</span>,
      content: (
        <>
          <div ref={ref => setFileListRef(ref)}></div>
          <div className="markdown-body" ref={ref => setRef(ref)}></div>
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
    <List.Item key={props.item.id}>
      <span onClick={() => showDetail()}>
        {getLevelLabel()}
        {props.item.title}
      </span>
    </List.Item>
  )

}