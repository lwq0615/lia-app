
import React from "react"
import { Upload, message } from 'antd'
import './index.scss'
import { updateHeadImg } from '@/package/request/system/user'
import defaultImg from '@/package/views/home/image/default.jpg'
import { getHeadImg } from '@/package/request/system/user'


class Index extends React.Component {


    state = {
        headImg: null
    }

    componentDidMount = () => {
        getHeadImg().then(fileId => {
            this.setState({
                headImg: fileId
            })
        })
    }

    /**
     * 上传头像
     * @param {} info 
     */
    uploadHeadImg = (info) => {
        updateHeadImg(info.file).then(res => {
            message.success(`上传成功`);
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
                        src={this.state.headImg
                            ? process.env.REACT_APP_HTTP_URL + "/system/file/getPic?comp=true&fileId=" + this.state.headImg
                            : defaultImg}
                    />
                </Upload>
            </section>
        )
    }
}

export default Index