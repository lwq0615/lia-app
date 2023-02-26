import { useRef, useState, useEffect } from "react"
import { Modal, Input, Form, message, Row, Col, Select, Switch } from "antd";
import { addSysNotice } from "@/package/request/index/notice";
import { getDictByKey } from "@/package/request/system/dictData";
import TabMarkdown from "./TabMarkdown";
import Upload from './Upload'
import MultipleTree from '@/package/components/form/MultipleTree'
import { getRoleDict } from "@/package/request/system/role";


type TreeItem= {
  label: string,
  value: any,
  children?: TreeItem[]
}


/**
 * 获取企业角色树
 */
const getRoleTree = () => {
  const roleTreeDict: TreeItem[] = []
  return getRoleDict().then((res: any) => {
    const companyRoleTree: any = {}
    res.forEach((item: any) => {
      if (!Array.isArray(companyRoleTree[item.remark])) {
        companyRoleTree[item.remark] = []
      }
      companyRoleTree[item.remark].push(item)
    })
    Object.keys(companyRoleTree).forEach(item => {
      roleTreeDict.push({
        label: item,
        value: "company:"+item,
        children: companyRoleTree[item]
      })
    })
    return roleTreeDict
  })
}


export default function Publish() {

  const formRef = useRef<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [roleTree, setRoleTree] = useState<TreeItem[]>([])
  const [levelOption, setLevelOption] = useState<any[]>([])
  const [confirmLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // 公告等级字典
    getDictByKey('sys:notice:level').then((res: any) => {
      setLevelOption(res);
      formRef.current.setFieldValue("level", res[0].value)
    })
    getRoleTree().then((res: TreeItem[]) => {
      setRoleTree(res)
    })
  }, [])

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await formRef.current.validateFields()
      values.publishTo = values.publishTo?.filter((item: any) =>typeof item === "number")
      values.topFlag = values.topFlag ? '1' : '0'
      const res: any = await addSysNotice(values)
      if (res > 0) {
        message.success("发布成功")
        setOpen(false)
        formRef.current.resetFields()
        formRef.current.setFieldValue("level", levelOption[0].value)
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
                    options={levelOption}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="推送给" name="publishTo" rules={[{ required: true, message: '请选择推送目标!' }]}>
                  <MultipleTree treeData={roleTree} title="推送给"/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="是否置顶" name="topFlag" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="附件" name="files">
                  <Upload />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <TabMarkdown />
        </div>
      </Modal>
    </>
  );
}