import request from "@/package/utils/request"

const baseUrl = '/system'


/**
 * 获取系统CPU内存
 */
export function systemInfo(){
  return request.get(baseUrl+"/info")
}