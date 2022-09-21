import request from "@/package/utils/request"

const baseUrl = '/system/dict'


/**
 * 获取字典类别列表
 */
export function typeNameMap(){
    return request.get(`${baseUrl}/typeNameMap`)
}


/**
 * 分页查询列表
 */
 export function getSysDictPage(dict,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,dict || {})
}


/**
 * 新增和编辑字典
 * @param {*} dict 字典参数，每条数据如果有dictId则为修改，dictId为null则为新增
 */
export function saveSysDict(dict){
    return request.post(`${baseUrl}/save`,dict)
}

/**
 * 修改字典类别信息
 */
export function updateDictType(dict,oldType, oldName){
    return request.post(`${baseUrl}/updateDictType?oldType=${oldType}&oldName=${oldName}`,dict)
}


/**
 * 批量删除字典
 * @param {*} dictIds 字典的id列表
 * @returns 删除成功的数量
 */
export function deleteDicts(dictIds){
    return request.post(`${baseUrl}/delete`,dictIds)
}


/**
 * 根据type删除字典
 */
export function deleteDictsByType(type){
    return request.get(`${baseUrl}/deleteDictsByType?type=${type}`)
}

/**
 * 获取性别字典表
 */
export function getSexDict(){
    return request.get(`${baseUrl}/getSysDict?type=sys:sex`)
}
