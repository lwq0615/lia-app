import { List } from "antd"
import modal from "@/package/components/modal/Modal"
import { marked } from "marked"
import { useEffect, useState } from "react"


export interface Notice {
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


export default function NoticeItem(props: {
  levelOption: any[],
  item: Notice
}) {

  const [ref, setRef] = useState<any>()

  useEffect(() => {
    ref && (ref.innerHTML = marked.parse(props.item.content || ''))
  }, [ref])

  const showDetail = () => {
    console.log(props.item);
    
    modal({
      title: <span>{getLevelLabel()}{props.item.title}</span>,
      content: (
        <div className="markdown-body" ref={ref => setRef(ref)}></div>
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
    <List.Item>
      <span onClick={() => showDetail()}>
        {getLevelLabel()}
        {props.item.title}
      </span>
    </List.Item>
  )

}