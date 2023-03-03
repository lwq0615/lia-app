import { useRef, useState, useEffect, ReactElement } from "react"
import { Modal, Input, Form, message, Row, Col, Select, Switch, Button, Spin } from "antd";
import { addSysNotice, deleteSysNotices, getFilesOfNotice, editSysNotice, getRolesOfNotice } from "@/package/request/index/notice";
import TabMarkdown from "./TabMarkdown";
import Upload from '@/package/components/form/Upload'
import MultipleTree from '@/package/components/form/MultipleTree'
import { Notice } from "./NoticeItem";
import { TreeItem } from "./Notice";
import Confirm from "@/package/components/confirm/Confirm";


export default function Publish(props: {
  onOk?: Function,
  notice?: Notice,
  levelOption: any[] | undefined,
  roleTree: TreeItem[] | undefined,
  className?: string,
  children?: ReactElement | null
}) {

  const [formRef, setFormRef] = useState<any>(null)
  const uploadRef = useRef<Upload>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [confirmLoading, setLoading] = useState<boolean>(false)
  const [content, setContent] = useState<string>()

  /**
   * 新增状态下设置默认等级
   */
  useEffect(() => {
    !props.notice && formRef && props.levelOption && formRef.setFieldValue("level", props.levelOption[0].value)
  }, [props.levelOption, formRef])

  /**
   * 编辑状态下设置表单默认值
   */
  useEffect(() => {
    if (props.notice && formRef) {
      setContent(props.notice.content)
      getRolesOfNotice(props.notice.id).then((res: any) => {
        formRef.setFieldsValue({
          ...props.notice,
          topFlag: props.notice?.topFlag === '1',
          publishTo: res.map((item: any) => item.roleId)
        })
      })
      getFilesOfNotice(props.notice.id).then(res => {
        uploadRef.current?.pushFileList(res as any || []);
      })
    }
  }, [formRef])

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await formRef.validateFields()
      values.publishTo = values.publishTo?.filter((item: any) => typeof item === "number")
      values.topFlag = values.topFlag ? '1' : '0'
      values.content = content
      // 上传附件
      uploadRef.current?.upload().then(async files => {
        // 全部上传成功
        values.files = files?.map(item => (item.originFileObj as any).fileId)
        if (props.notice) {
          var res: any = await editSysNotice({
            ...values,
            id: props.notice.id
          })
        } else {
          var res: any = await addSysNotice(values)
        }
        if (res > 0) {
          message.success("发布成功")
          setOpen(false)
          formRef.resetFields()
          setContent(void 0)
          if (props.levelOption?.length) {
            formRef.setFieldValue("level", props.levelOption[0].value)
          }
          props.onOk && props.onOk()
        } else {
          message.warning("发布失败")
        }
        setLoading(false)
      }).catch(err => {
        message.error("部分文件上传失败!请重试或者取消上传")
        setLoading(false)
        return
      })
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  };

  function deleteHandler() {
    setLoading(true)
    deleteSysNotices([props.notice?.id]).then((res: any) => {
      if (res > 0) {
        message.success("删除成功")
        setLoading(false)
        setOpen(false)
      } else {
        message.warning("删除失败")
        setLoading(false)
      }
    })
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className={props.className}>{props.children}</span>
      <Modal
        centered
        className="publish-notice-modal"
        title="发布通知/公告"
        open={open}
        okText="发布"
        footer={null}
        destroyOnClose={Boolean(props.notice)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <Spin spinning={confirmLoading}>
          <div className="form-body">
            <Form ref={ref => setFormRef(ref)} labelCol={{ span: 6 }}>
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
          <div className="ant-modal-footer">
            <Button onClick={() => setOpen(false)}>取消</Button>
            {props.notice && <Confirm size="default" deleteSubmit={deleteHandler} />}
            <Button type="primary" onClick={handleOk}>发布</Button>
          </div>
        </Spin>
      </Modal>
    </>
  );
}