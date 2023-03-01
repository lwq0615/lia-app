import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile } from 'antd/lib/upload';
import { uploadFile, getFileUrl } from '@/package/request/system/file';
import './css/upload.scss'


interface SysFile {
  fileId: number,
  name: string,
  path: string,
  size: number,
  uploadTime: string,
  uploadUser: number
}


export default class App extends React.Component<{
  onChange?: ([]) => void
}> {

  state = {
    fileList: [],
    uProps: {
      name: 'file',
      beforeUpload: () => false,
      onChange: (info: any) => {
        info.fileList.forEach((item: UploadFile) => {
          if(item.status === 'success'){
            return
          }
          item.url = window.URL.createObjectURL(item.originFileObj as Blob)
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

  /**
   * 设置已经上传的文件列表
   */
  pushFileList = (list: SysFile[]) => {
    const files: UploadFile[] = []
    list?.forEach(item => {
      files.push({
        status: "success",
        name: item.name,
        uid: item.path.split("/").pop()?.split(".").slice(0, -1).join(".") as string,
        url: getFileUrl(item.fileId)
      })
    })
    this.setState({
      fileList: files as any,
      success: list
    })
  }

  upload: () => Promise<{
    success: SysFile[],
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
