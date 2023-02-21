import request from "@/package/utils/request"

const baseUrl = '/system/file'


/**
 * 获取图片资源地址
 * @param fileId 图片文件id
 * @param comp 是否压缩
 */
export function getPicUrl(fileId, comp = true){
    const url = process.env.REACT_APP_HTTP_URL+baseUrl+"/getPic"
    const headerName = process.env.REACT_APP_HTTP_HEADER
    const token = localStorage.getItem(process.env.REACT_APP_HTTP_HEADER)
    return `${url}?fileId=${fileId}&comp=${comp}&${headerName}=${token}`
}
