
import React from 'react'
import Crud from '@/package/components/crud/Crud'
import { getSysRegisterCodePage, editSysRegisterCode, deleteSysRegisterCodes } from '@/package/request/system/registerCode'
import { getRoleDict } from '@/package/request/system/role'
import { Button, message, Modal } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import CodeForm from './CodeForm.tsx'
import { getCreaterDict } from '@/package/request/system/user'


export default class SysRegisterCode extends React.Component {

  state = {
    open: false,
    option: {
      // 表格名称
      tableName: "注册码",
      // 是否显示行索引，默认true
      showIndex: true,
      // 是否展示右侧操作栏，默认["edit", "delete"]
      rightAction: true,
      // 配置按钮组，默认["add", "delete", "search", "excel"]
      menuBtns: [() => {
        const openModal = () => {
          this.setState({ open: true })
        }
        return (
          <Button type='primary' icon={<PlusOutlined />} key="register" onClick={openModal}>生成注册码</Button>
        )
      }, "delete", "search", "excel"],
      // 表格行是否可选择(默认false)
      selection: true,
      // 触发删除钩子 records => {}
      //return true刷新页面数据
      onDelete: async records => {
        return await deleteSysRegisterCodes(records.map(item => item.id)).then(res => {
          if (res > 0) {
            message.success("删除成功")
            return true
          } else {
            message.error("删除失败")
            return false
          }
        })
      },
      // 需要加载数据时触发 params => {}
      getPage: (params = {}, page = {}) => {
        params.createTime = params.createTime?.join(",")
        return getSysRegisterCodePage(params, page.current, page.size)
      },
      // 新增编辑提交钩子 async (form, type) => {}
      // 如果需要获取返回值再关闭弹窗，请使用await
      // return true刷新页面
      onSave: async (form, type) => {
        return await editSysRegisterCode(form).then(res => {
          message.success(type + "成功")
          return true
        })
      },
      columns: [
        {
          title: '注册码',
          dataIndex: 'code',
          align: 'center',
          key: 'code',
          required: true,
          addShow: false,
          editShow: false,
          span: 6
        },
        {
          title: '可激活角色',
          dataIndex: 'roleId',
          align: 'center',
          key: 'roleId',
          required: true,
          type: "select",
          dict: getRoleDict,
          span: 6
        },
        {
          title: '是否已使用',
          dataIndex: 'used',
          required: false,
          addShow: false,
          detailShow: false,
          show: false,
          editShow: false,
          span: 6,
          type: "select",
          dict: [
            {
              label: '已使用',
              value: true
            },
            {
              label: "未使用",
              value: false
            }
          ]
        },
        {
          title: '使用用户ID',
          dataIndex: 'useBy',
          align: 'center',
          key: 'useBy',
          required: false,
          addShow: false,
          editShow: false,
          nullValue: "未使用",
          span: 6
        },
        {
          title: '使用时间',
          dataIndex: 'useTime',
          align: 'center',
          key: 'useTime',
          required: false,
          addShow: false,
          editShow: false,
          type: "datetime",
          range: true,
          nullValue: "未使用"
        },
        {
          title: '创建人',
          dataIndex: 'creater',
          align: 'center',
          key: 'creater',
          addShow: false,
          editShow: false,
          required: false,
          type: 'select',
          dict: getCreaterDict
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          key: 'createTime',
          addShow: false,
          editShow: false,
          required: false,
          type: "datetime",
          range: true
        }
      ]
    }
  }

  render() {
    return (
      <>
        <Crud {...this.state.option} style={{ padding: 24 }} />
        <Modal
          open={this.state.open}
          title="生成注册码"
          width={700}
          centered
          destroyOnClose
          keyboard
          okText="确定"
          footer={null}
          onCancel={() => this.setState({ open: false })}
        >
          <CodeForm></CodeForm>
        </Modal>
      </>
    )
  }

}          
