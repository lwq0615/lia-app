import { useRef, useState, ChangeEvent } from "react"
import { marked } from "marked"
import { Modal, Input, Form } from "antd";

const { TextArea } = Input;

function TextModal(props: any) {

  const textRef = useRef<any>(null)
  const markdown = useRef<any>(null)
  const formRef = useRef<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [task, setTask] = useState<NodeJS.Timeout>()
  const [confirmLoading, setLoading] = useState<boolean>(false)

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await formRef.current.validateFields()
      console.log(values);
      // props.onOk(value)
      setLoading(false)
      setOpen(false)
    } catch (e) {
      setLoading(false)
    }
  };
  const handleCancel = () => {
    setOpen(false)
  };

  /**
   * markdown文本改变
   */
  const markChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    clearTimeout(task)
    const id: NodeJS.Timeout = setTimeout(() => {
      if (markdown.current) {
        markdown.current.innerHTML = marked.parse(e.target.value)
      }
    }, 1000)
    setTask(id)
  }

  return (
    <>
      <a onClick={() => setOpen(true)} style={{ userSelect: 'none' }}>发布</a>
      <Modal
        centered
        className="publish-notice"
        title="发布通知/公告"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        width={1200}
      >
        <Form ref={formRef}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题!' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <div className="markdown">
            <Form.Item label="详情" name="content">
              <TextArea placeholder="Markdown" className="form-content" ref={textRef} onChange={markChange} />
            </Form.Item>
            <Form.Item label="预览">
              <div className='markdown-body' ref={markdown}></div>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}


export default function Notice() {

  const markdown = useRef<any>(null)

  const onOk = (value: string) => {
    markdown.current.innerHTML = marked.parse(value)
  }

  return (
    <div className="index-notice">
      <h3 className='title'>
        通知/公告
        <TextModal onOk={onOk} />
      </h3>
    </div>
  )
}