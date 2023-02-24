import { Upload, message } from 'antd'
import './index.scss'
import { updateHeadImg } from '@/package/request/system/user'
import defaultImg from '@/package/views/home/image/default.jpg'
import { getPicUrl } from "@/package/request/system/file"
import { useSelector, useDispatch } from 'react-redux'
import { login } from '@/package/store/loginUserSlice'


export default function UserInfo() {

  const userInfo = useSelector((state: any) => state.loginUser.userInfo)
  const dispatch = useDispatch()

  /**
   * 上传头像
   * @param {} info 
   */
  const uploadHeadImg = (info: any) => {
    updateHeadImg(info.file).then((res: any) => {
      dispatch(login({...userInfo, headImg: res.fileId}))
      message.success(`上传成功`);
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
          src={userInfo.headImg
            ? getPicUrl(userInfo.headImg)
            : defaultImg}
        />
      </Upload>
    </div>
  )
}