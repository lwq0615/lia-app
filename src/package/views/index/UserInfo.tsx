import { Upload, message } from 'antd'
import './index.scss'
import { updateHeadImg } from '@/package/request/system/user'
import defaultImg from '@/package/views/home/image/default.jpg'
import { getPicUrl } from "@/package/request/system/file"
import { useSelector, useDispatch } from 'react-redux'
import { login } from '@/package/store/loginUserSlice'
import { Statistic } from "antd";


export default function UserInfo() {

  const userInfo = useSelector((state: any) => state.loginUser.userInfo)
  const dispatch = useDispatch()

  let timeText = '早上好'
  if (new Date().getHours() > 18) {
    timeText = "晚上好"
  } else if (new Date().getHours() > 12) {
    timeText = "下午好"
  }

  /**
   * 上传头像
   * @param {} info 
   */
  const uploadHeadImg = (info: any) => {
    updateHeadImg(info.file).then((res: any) => {
      dispatch(login({ ...userInfo, headImg: res.fileId }))
      message.success(`上传成功`);
    }, err => {
      message.error(`上传失败`);
    })
  }

  return (
    <div className='index-user-info card'>
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
      <div className='text'>
        <h3>{timeText}，{userInfo.nick}，祝你开心每一天！</h3>
        <span>lia 是一个企业级中后台前端/设计解决方案，致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件。</span>
      </div>
      <div className='data'>
        <Statistic
          title="企业"
          valueStyle={{ fontSize: 16 }}
          value={userInfo.companyName}
        />
        <Statistic
          title="职务"
          valueStyle={{ fontSize: 16 }}
          value={userInfo.roleName}
        />
      </div>
    </div>
  )
}