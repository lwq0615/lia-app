import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload';




const App: React.FC = () => {

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const props: UploadProps = {
    name: 'file',
    beforeUpload: (file) => {
      return false
    },
    onChange: (info) => {
      setFileList([...info.fileList]);
    },
    multiple: true
  };

  return (
    <Upload {...props} fileList={fileList}>
      <Button icon={<UploadOutlined />}>上传附件</Button>
    </Upload>
  );

}

export default App;
