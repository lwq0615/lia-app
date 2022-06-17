import request from "@/package/utils/request"

const baseUrl = '/system/file'


/**
 * 下载文件
 */
export function getSysFile(file){
    return request.post(`${baseUrl}/getPage`,file)
}
