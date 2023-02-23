import { useEffect, useRef, useState, ChangeEvent } from "react"
import { marked } from "marked"
import { Modal, Input } from "antd";

const { TextArea } = Input;

function TextModal(props: any) {

  const textRef = useRef<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const handleOk = () => {
    props.onOk(value)
    setOpen(false)
  };
  const handleCancel = () => {
    setOpen(false)
  };
  const valueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  return (
    <>
      <a onClick={() => setOpen(true)} style={{userSelect: 'none'}}>发布</a>
      <Modal
        title="发布通知/公告"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Input placeholder="标题" style={{ marginBottom: 12 }} />
        <TextArea placeholder="Markdown" style={{ resize: 'none', height: 500 }} ref={textRef} value={value} onChange={valueChange}/>
      </Modal>
    </>
  );
}


export default function Notice() {

  const markdown = useRef<any>(null)

  const onOk = (value: string) => {
    markdown.current.innerHTML = marked.parse(value)
  }

  useEffect(() => {
    markdown.current.innerHTML = marked.parse(``)
  }, [])

  return (
    <div className="index-notice">
      <h3 className='title'>
        通知/公告
        <TextModal onOk={onOk}/>
      </h3>
      <div className='markdown-body' ref={markdown}></div>
    </div>
  )
}