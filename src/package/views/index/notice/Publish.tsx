import { useRef, useState, useEffect, createElement } from "react"
import { marked } from "marked"
import { Modal, Input, Form, message, Row, Col, Select, Switch, Tabs } from "antd";
import { addSysNotice } from "@/package/request/index/notice";
import { getDictByKey } from "@/package/request/system/dictData";

const { TextArea } = Input;


function TabMarkdown(props: any) {

  const markdown = useRef<any>(null)
  const [value, setValue] = useState<string>('')

  function valueChange(e: any) {
    setValue(e.target.value);
    props.onChange(e.target.value)
  }

  const items = [
    {
      label: '编辑',
      key: 'edit',
      forceRender: true,
      children: (
        <TextArea placeholder="Markdown" className="form-content" onChange={valueChange} />
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
      markdown.current.innerHTML = marked.parse(value)
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



export default function Publish() {

  const formRef = useRef<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [levelOption, setLevelOption] = useState([])
  const [confirmLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    getDictByKey('sys:notice:level').then((res: any) => {
      setLevelOption(res);
      formRef.current.setFieldValue("level", res[0].value)
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
      } else {
        message.warning("发布失败")
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  };

  return (
    <>
      <a onClick={() => setOpen(true)} style={{ userSelect: 'none' }}>发布</a>
      <Modal
        centered
        className="publish-notice"
        title="发布通知/公告"
        open={open}
        forceRender
        onOk={handleOk}
        okText="发布"
        onCancel={() => setOpen(false)}
        confirmLoading={confirmLoading}
        width={1000}
      >
        <Form ref={formRef}>
          <Row gutter={24}>
            <Col span={14}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题!' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="等级" name="level" rules={[{ required: true, message: '请选择等级!' }]}>
                <Select
                  placeholder="请选择"
                  options={levelOption}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="是否置顶" name="topFlag" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="详情" name="content" style={{ marginBottom: 20 }}>
                <TabMarkdown />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}