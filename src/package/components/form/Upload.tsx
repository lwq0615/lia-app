import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload';
import { uploadFile } from '@/package/request/system/file';


export default class App extends React.Component<{
  onChange?: ([]) => void
}> {

  state = {
    fileList: [],
    uProps: {
      name: 'file',
      beforeUpload: () => false,
      onChange: (info: any) => {
        info.fileList.forEach((item: any) => {
          item.url = window.URL.createObjectURL(item.originFileObj)
        })
        this.setState({
          fileList: [...info.fileList]
        })
        if (this.props.onChange) this.props.onChange([...info.fileList])
      },
      multiple: true
    }
  }

  upload = async () => {
    this.setState({
      fileList: this.state.fileList.map((item: any) => {
        item.status = "uploading"
        return item
      })
    })
    return new Promise((resolve, reject) => {
      const success: UploadFile[] = []
      const error: UploadFile[] = []
      const task = this.state.fileList.map((file: UploadFile) => {
        return uploadFile(file.originFileObj).then(res => {
          file.status = "success"
          success.push(file)
        }).catch(e => {
          file.status = "error"
          error.push(file)
        })
      })
      Promise.all(task).then(res => {
        resolve({success, error})
      })
    })
  }

  render(): React.ReactNode {
    return (
      <Upload {...this.state.uProps} fileList={this.state.fileList}>
        <Button icon={<UploadOutlined />}>上传附件</Button>
      </Upload>
    )
  }
};
