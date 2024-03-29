import { useRef, useState } from "react"
import { marked } from "marked"
import { Input, Tabs } from "antd";

const { TextArea } = Input;



export default function TabMarkdown(props: any) {

  const markdown = useRef<any>(null)

  function valueChange(e: any) {
    props.onChange(e.target.value)
  }

  const items = [
    {
      label: '编辑',
      key: 'edit',
      forceRender: true,
      children: (
        <TextArea placeholder="详情" className="form-content" onChange={valueChange} value={props.value}/>
      )
    },
    {
      label: '预览',
      key: 'preview',
      forceRender: true,
      children: (
        <div className='markdown-body' ref={markdown}></div>
      )
    }
  ]

  const tabChange = (key: string) => {
    if (key === 'preview') {
      markdown.current.innerHTML = marked.parse(props.value || '')
    }
  }

  return (
    <Tabs
      onChange={tabChange}
      type="card"
      items={items}
    />
  )
}