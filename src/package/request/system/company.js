import request from "@/package/utils/request"

const baseUrl = '/system/company'

/**
 * 分页查询列表
 * @param {*} company 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysCompanyPage(company,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,company || {})
}


/**
 * 新增和编辑
 */
export function saveSysCompany(company){
    return request.post(`${baseUrl}/save`,company)
}


/**
 * 批量删除
 * @param {*} companyIds id列表
 * @returns 删除成功的数量
 */
export function deleteCompanys(companyIds){
    return request.post(`${baseUrl}/delete`,companyIds)
}

/**
 * 获取企业字典表
 */
export function getCompanyDict(){
    return request.get(`${baseUrl}/sysCompanyDict`)
}