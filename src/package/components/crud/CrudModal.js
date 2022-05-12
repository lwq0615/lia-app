import { Modal } from 'antd';
import React from 'react';
import propTypes from 'prop-types'
import CrudForm from './CrudForm';

class CrudModal extends React.Component {

  static propTypes = {
    visible: propTypes.bool.isRequired,
    setVisible: propTypes.func.isRequired,
    title: propTypes.string
  }

  state = {
    loading: false
  }

  /**
   * 点击确定
   */
  handleOk = async () => {
    this.setState({
      loading: true
    })
    let form = null
    try {
      form = await this.crudFormRef.formRef.validateFields()
    }catch(error) {
      this.setState({
        loading: false
      })
      return
    }
    for (let key of Object.keys(form)) {
      form[key] = form[key] === '' ? undefined : form[key]
    }
    await this.props.onSubmit(form, this.props.title)
    this.setState({
      loading: false
    })
    this.props.setVisible(false)
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
          width={700}
          title={this.props.title}
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.loading}
          onCancel={this.handleCancel}
        >
          <CrudForm columns={this.props.columns} ref={ref => this.crudFormRef = ref} title={this.props.title} />
        </Modal>
      </>
    )
  };

}


export default CrudModal;