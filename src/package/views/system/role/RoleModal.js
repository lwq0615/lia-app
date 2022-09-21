import { Modal } from 'antd';
import React from 'react';
import propTypes from 'prop-types'
import RoleForm from './RoleForm';

class RoleModal extends React.Component {

  static propTypes = {
    visible: propTypes.bool.isRequired,
    setVisible: propTypes.func.isRequired,
    form: propTypes.object,
    getRouterTree: propTypes.func.isRequired,
    getAuthTree: propTypes.func.isRequired,
    onSave: propTypes.func.isRequired,
    onSearch: propTypes.func.isRequired
  }

  state = {
    loading: false
  }

  formRef = null

  /**
   * 点击确定,表单提交
   */
  handleOk = async () => {
    this.setState({
      loading: true
    })
    let form = {}
    try {
      form = await this.formRef?.validateFields() || {}
      if(this.props.form){
        form = Object.assign(this.props.form, form)
      }
      if (await this.props.onSave(form, this.props.form ? "编辑" : "新增")) {
        this.props.onSearch()
        this.props.setVisible(false)
      }
      this.setState({
        loading: false
      })
    } catch (error) {
      this.setState({
        loading: false
      })
      throw error
    }
  };

  /**
   * 点击取消
   */
  handleCancel = () => {
    this.props.setVisible(false);
  };

  render() {
    return (
      <>
        <Modal
          className='lia-crud-modal'
          centered
          width={800}
          destroyOnClose
          title={this.props.form ? "编辑" : "新增"}
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.loading}
          onCancel={this.handleCancel}
        >
          <RoleForm
            formDefaultValues={this.props.form}
            getRouterTree={this.props.getRouterTree}
            getAuthTree={this.props.getAuthTree}
            setRef={(ref) => this.formRef = ref}
          />
        </Modal>
      </>
    )
  };

}


export default RoleModal;