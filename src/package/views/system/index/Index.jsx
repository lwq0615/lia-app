
import React from "react"
import { Upload, message } from 'antd'
import './index.scss'
import { updateHeadImg } from '@/package/request/system/user'
import defaultImg from '@/package/views/home/image/default.jpg'
import { getPicUrl } from "@/package/request/system/file"


class Index extends React.Component {

    /**
     * 上传头像
     * @param {} info 
     */
    uploadHeadImg = (info) => {
        updateHeadImg(info.file).then(res => {
            message.success(`上传成功`);
            this.props.reloadHeadImg()
        }, err => {
            message.error(`上传失败`);
        })
    }
    

    render() {
        return (
            <section className="system-index">
                <Upload
                    accept='image/*'
                    customRequest={this.uploadHeadImg}
                    showUploadList={false}
                >
                    <img
                        className="headImg"
                        src={this.props.headImg
                            ? getPicUrl(this.props.headImg)
                            : defaultImg}
                    />
                </Upload>
            </section>
        )
    }
}

export default Index