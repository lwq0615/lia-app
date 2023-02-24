import { useRef, useState, ChangeEvent, useEffect } from "react"
import { marked } from "marked"
import { Modal, Input, Form, message, Row, Col, Select, Switch } from "antd";
import { addSysNotice } from "@/package/request/index/notice";
import { getDictByKey } from "@/package/request/system/dictData";

const { TextArea } = Input;

function PublishModal() {

  const textRef = useRef<any>(null)
  const markdown = useRef<any>(null)
  const formRef = useRef<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [levelOption, setLevelOption] = useState([])
  const [task, setTask] = useState<NodeJS.Timeout>()
  const [confirmLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getDictByKey('sys:notice:level').then((res: any) => {
      setLevelOption(res);
    })
  }, [])

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await formRef.current.validateFields()
      values.topFlag = values.topFlag ? '1' : '0'
      const res: any = await addSysNotice(values)
      if (res > 0) {
        message.success("发布成功")
        setOpen(false)
        formRef.current.resetFields()
        markdown.current.innerHTML = ''
      } else {
        message.warning("发布失败")
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
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
        onCancel={() => setOpen(false)}
        confirmLoading={confirmLoading}
        width={1200}
      >
        <Form ref={formRef}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题!' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="等级" name="level" rules={[{ required: true, message: '请选择等级!' }]}>
                <Select
                  placeholder="请选择"
                  options={levelOption}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="是否置顶" name="topFlag" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="详情" name="content">
                <TextArea placeholder="Markdown" className="form-content" ref={textRef} onChange={markChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预览">
                <div className='markdown-body' ref={markdown}></div>
              </Form.Item>
            </Col>
          </Row>
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
        <PublishModal />
      </h3>
    </div>
  )
}