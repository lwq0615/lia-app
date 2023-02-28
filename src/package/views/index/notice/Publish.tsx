import { useRef, useState, useEffect, ReactElement } from "react"
import { Modal, Input, Form, message, Row, Col, Select, Switch, Button } from "antd";
import { addSysNotice } from "@/package/request/index/notice";
import TabMarkdown from "./TabMarkdown";
import Upload from '@/package/components/form/Upload'
import MultipleTree from '@/package/components/form/MultipleTree'
import { Notice } from "./NoticeItem";
import { TreeItem } from "./Notice";


export default function Publish(props: {
  onOk?: (values: object) => void,
  notice?: Notice,
  levelOption: any[] | undefined,
  roleTree: TreeItem[] | undefined,
  className?: string,
  children?: ReactElement
}) {

  const formRef = useRef<any>(null)
  const uploadRef = useRef<Upload>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [confirmLoading, setLoading] = useState<boolean>(false)
  const [content, setContent] = useState<string>()

  useEffect(() => {
    props.levelOption && formRef.current?.setFieldValue("level", props.levelOption[0].value)
  }, [props.levelOption])

  const openModal = () => {
    setOpen(true)
    if (props.notice) {
      setContent(props.notice.content)
      formRef.current?.setFieldsValue({
        ...props.notice
      })
    }
  }

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await formRef.current.validateFields()
      values.publishTo = values.publishTo?.filter((item: any) => typeof item === "number")
      values.topFlag = values.topFlag ? '1' : '0'
      values.content = content
      const uploadRes = await uploadRef.current?.upload()
      if (uploadRes) {
        const { success, error } = uploadRes
        values.files = success.map(item => item.fileId)
        if (error.length) {
          message.error("部分文件上传失败!请重试或者取消上传")
          setLoading(false)
          return
        }
      }
      const res: any = await addSysNotice(values)
      if (res > 0) {
        message.success("发布成功")
        setOpen(false)
        formRef.current.resetFields()
        setContent(void 0)
        if (props.levelOption?.length) {
          formRef.current.setFieldValue("level", props.levelOption[0].value)
        }
        props.onOk && props.onOk(values)
      } else {
        message.warning("发布失败")
      }
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  };

  return (
    <>
      <span onClick={openModal} className={props.className}>{props.children}</span>
      <Modal
        centered
        className="publish-notice-modal"
        title="发布通知/公告"
        open={open}
        forceRender={!props.notice}
        okText="发布"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>取消</Button>
            {props.notice && <Button type="primary" danger>删除</Button>}
            <Button type="primary" onClick={handleOk}>发布</Button>
          </>
        }
        onCancel={() => setOpen(false)}
        confirmLoading={confirmLoading}
        width={1000}
      >
        <div className="form-body">
          <Form ref={formRef} labelCol={{ span: 6 }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="标题"
                  name="title"
                  rules={[{ required: true, message: '请输入标题!' }]}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="等级" name="level" rules={[{ required: true, message: '请选择等级!' }]}>
                  <Select
                    placeholder="请选择"
                    options={props.levelOption}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="推送给" name="publishTo" rules={[{ required: true, message: '请选择推送目标!' }]}>
                  <MultipleTree treeData={props.roleTree || []} title="推送给" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="是否置顶" name="topFlag" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="附件" name="files">
                  <Upload ref={uploadRef} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <TabMarkdown value={content} onChange={setContent} />
        </div>
      </Modal>
    </>
  );
}