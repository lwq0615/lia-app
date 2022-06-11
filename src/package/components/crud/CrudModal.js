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
   * 点击确定,表单提交
   */
  handleOk = async () => {
    this.setState({
      loading: true
    })
    let form = {}
    try {
      form = await this.saveFormRef.getFormValue() || {}
      if (await this.props.onSave(form, this.props.title)) {
        this.props.search()
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
          title={this.props.title}
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.loading}
          onCancel={this.handleCancel}
        >
          <CrudForm
            formDefaultValues={{ ...this.props.formDefaultValues }}
            columns={this.props.columns}
            ref={ref => this.saveFormRef = ref}
            title={this.props.title}
            dict={this.props.dict}
          />
        </Modal>
      </>
    )
  };

}


export default CrudModal;