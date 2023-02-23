import { Upload, message } from 'antd'
import './index.scss'
import { updateHeadImg } from '@/package/request/system/user'
import defaultImg from '@/package/views/home/image/default.jpg'
import { getPicUrl } from "@/package/request/system/file"


export default function UserInfo(props: any) {

  /**
   * 上传头像
   * @param {} info 
   */
  const uploadHeadImg = (info: any) => {
    updateHeadImg(info.file).then(res => {
      message.success(`上传成功`);
      props.reloadHeadImg()
    }, err => {
      message.error(`上传失败`);
    })
  }

  return (
    <div className='index-user-info'>
      <Upload
        accept='image/*'
        customRequest={uploadHeadImg}
        showUploadList={false}
      >
        <img
          className="headImg"
          src={props.headImg
            ? getPicUrl(props.headImg)
            : defaultImg}
        />
      </Upload>
    </div>
  )
}