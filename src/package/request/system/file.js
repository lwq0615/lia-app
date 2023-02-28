import request from "@/package/utils/request"

const baseUrl = '/system/file'


/**
 * 获取图片资源地址
 * @param fileId 图片文件id
 * @param comp 是否压缩
 */
export function getPicUrl(fileId, comp = true) {
    const url = process.env.REACT_APP_HTTP_URL + baseUrl + "/getPic"
    const headerName = process.env.REACT_APP_HTTP_HEADER
    const token = localStorage.getItem(process.env.REACT_APP_HTTP_HEADER)
    return `${url}?fileId=${fileId}&comp=${comp}&${headerName}=${token}`
}



/**
 * 上传文件
 * @param files 上传文件列表
 * @return 上传成功的数量
 */
export function uploadFile(file) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("uuid", file.uid)
    return request.post(`${baseUrl}/upload`, formData)
}


/**
 * 获取文件资源下载地址
 */
export function getFileUrl(fileId) {
    const url = process.env.REACT_APP_HTTP_URL + baseUrl + "/getFile"
    const headerName = process.env.REACT_APP_HTTP_HEADER
    const token = localStorage.getItem(process.env.REACT_APP_HTTP_HEADER)
    return `${url}?fileId=${fileId}&${headerName}=${token}`
}