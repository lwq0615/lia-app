import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload';
import { uploadFile } from '@/package/request/system/file';
import './css/upload.scss'


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
    },
    success: []
  }

  upload: () => Promise<{
    success: any[],
    error: UploadFile[]
  } | void> = async () => {
    if(!Array.isArray(this.state.fileList) || !this.state.fileList.length){
      return
    }
    this.setState({
      fileList: this.state.fileList.map((item: any) => {
        if(item.status !== 'success'){
          item.status = "uploading"
        }
        return item
      })
    })
    return new Promise((resolve, reject) => {
      const error: UploadFile[] = []
      const task = this.state.fileList.map((file: UploadFile) => {
        if(file.status === "success"){
          return
        }
        return uploadFile(file.originFileObj).then(res => {
          file.status = "success"
          this.state.success.push(res as never)
        }).catch(e => {
          file.status = "error"
          error.push(file)
        })
      })
      Promise.all(task).then(res => {
        this.setState({
          fileList: this.state.fileList
        })
        resolve({success: this.state.success, error})
      })
    })
  }

  render(): React.ReactNode {
    return (
      <Upload {...this.state.uProps} fileList={this.state.fileList} className="lia-form-upload">
        <Button icon={<UploadOutlined />}>上传附件</Button>
      </Upload>
    )
  }
};
