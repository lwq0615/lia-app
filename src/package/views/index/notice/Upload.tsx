import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload';


const App: React.FC = (props: any) => {

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const uProps: UploadProps = {
    name: 'file',
    beforeUpload: (file) => {
      return false
    },
    onChange: (info) => {
      setFileList([...info.fileList]);
      if(props.onChange) props.onChange([...info.fileList])
    },
    multiple: true
  };

  return (
    <Upload {...uProps} fileList={fileList}>
      <Button icon={<UploadOutlined />}>上传附件</Button>
    </Upload>
  );

}

export default App;
