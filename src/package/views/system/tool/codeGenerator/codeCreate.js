import moment from 'moment';

/**
 * 下划线转驼峰
 */
export function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}


/**
 * 驼峰转下划线
 */
export function toLine(name) {
    return firstLow(name).replace(/([A-Z])/g, "_$1").toLowerCase();
}


/**
 * 首字母大写
 */
export function firstUp(str){
    return str.substring(0,1).toUpperCase()+str.substring(1)
}

/**
 * 首字母小写
 */
export function firstLow(str){
    return str.substring(0,1).toLowerCase()+str.substring(1)
}


/**
 * 接口调用代码生成
 */
export function requestCode({tableName, httpUrl}){
    if(httpUrl && httpUrl[0] === '/'){
        httpUrl = httpUrl.substring(1)
    }
    if(httpUrl && httpUrl[httpUrl.length-1] === '/'){
        httpUrl = httpUrl.substring(0,httpUrl.length-1)
    }
    return `
import request from "@/package/utils/request"

const baseUrl = '/${httpUrl}'

/**
 * 分页查询列表
 * @param {*} ${firstLow(toHump(tableName))} 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function get${firstUp(toHump(tableName))}Page(${firstLow(toHump(tableName))},current,size){
    return request.post(\`\${baseUrl}/getPage?current=\${current || ''}&size=\${size || ''}\`,${firstLow(toHump(tableName))} || {})
}


/**
 * 新增和编辑
 */
export function save${firstUp(toHump(tableName))}(${firstLow(toHump(tableName))}){
    return request.post(\`\${baseUrl}/save\`,${firstLow(toHump(tableName))})
}


/**
 * 批量删除
 * @param {*} ${firstLow(toHump(tableName))}Ids id列表
 * @returns 删除成功的数量
 */
export function delete${firstUp(toHump(tableName))}s(${firstLow(toHump(tableName))}Ids){
    return request.post(\`\${baseUrl}/delete\`,${firstLow(toHump(tableName))}Ids)
}               
`
}

function dataConcat(data, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag){
    if(createByFlag){
        data = data.concat({
            len: 0,
            name: "createBy",
            notNull: false,
            remark: "创建人",
            type: "Long",
            unique: false,
            createBy: true
        })
    }
    if(createTimeFlag){
        data = data.concat({
            len: 0,
            name: "createTime",
            notNull: false,
            remark: "创建时间",
            type: "datetime",
            unique: false,
            createTime: true
        })
    }
    if(updateTimeFlag){
        data = data.concat({
            len: 0,
            name: "updateTime",
            notNull: false,
            remark: "更新时间",
            type: "datetime",
            unique: false,
            updateTime: true
        })
    }
    if(remarkFlag){
        data = data.concat({
            len: 500,
            name: "remarkFlag",
            notNull: false,
            remark: "备注",
            type: "String",
            unique: false,
            like: true
        })
    }
    return data
}

/**
 * 前端文件代码生成
 */
export function viewCode({data, tableName, primaryKey, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag}){
    data = dataConcat(data, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag)
    function getColumnsCode(){
        return data.map(item => {
            return `                {
                    title: '${item.remark}',
                    dataIndex: '${item.name}',
                    align: 'center',
                    required: ${item.notNull},
                    addShow: ${item.createBy || item.createTime || item.updateTime ? 'false' : "true"},
                    editShow: ${item.createBy || item.createTime || item.updateTime ? 'false' : "true"}${item.type.includes("date") ? ',\n                    type: "'+item.type+'",\n                    range: true' : ""}
                }`
        }).join(",\n")
    }
    return `
import React from 'react'
import Crud from '@/package/components/crud/Crud'
import { get${firstUp(toHump(tableName))}Page, save${firstUp(toHump(tableName))}, delete${firstUp(toHump(tableName))}s } from '@/package/request/system/${firstLow(toHump(tableName))}'
import { message } from "antd"


export default class ${firstUp(toHump(tableName))} extends React.Component{

    state = {
        option: {
            // 表格名称
            tableName: "${tableName}",
            // 是否显示行索引，默认true
            showIndex: true,
            // 是否展示右侧操作栏，默认["edit", "delete"]
            rightAction: true,
            // 配置按钮组，默认["add", "delete", "search", "excel"]
            menuBtns: true,
            // 表格行是否可选择(默认false)
            selection: true,
            // 触发删除钩子 records => {}
            //return true刷新页面数据
            onDelete: async records => {
                return await delete${firstUp(toHump(tableName))}s(records.map(item => item.${primaryKey.name})).then(res => {
                    if(res > 0){
                        message.success("删除成功")
                        return true
                    }else{
                        message.error("删除失败")
                        return false
                    }
                })
            },
            // 需要加载数据时触发 params => {}
            getPage: (params = {}, page = {}) => {
                params.createTime = params.createTime?.join(",")
                return get${firstUp(toHump(tableName))}Page(params, page.current, page.size)
            },
            // 新增编辑提交钩子 async (form, type) => {}
            // 如果需要获取返回值再关闭弹窗，请使用await
            // return true刷新页面
            onSave: async (form, type) => {
                return await save${firstUp(toHump(tableName))}(form).then(res => {
                    if(res === 'error'){
                        message.warning("未知错误")
                        return false
                    }else if(res === 'success'){
                        message.success(type+"成功")
                        return true
                    }else{
                        message.warning(res)
                        return false
                    }
                })
            },
            columns: [
${getColumnsCode()}
            ]
        }
    }

    render(){
        return (
            <Crud {...this.state.option}/>
        )
    }
    
}          
`
}


/**
 * 实体类代码生成
 */
export function entityCode({data, tableName, primaryKey, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag}) {
    data = dataConcat(data, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag)
    const columnCode = () => {
        let str = `    /**
     * 主键
     */
    @TableId(type = ${primaryKey.type === "autoIncrement" ? "IdType.AUTO" : "IdType.ASSIGN_ID"})
    @TableField("\`${toLine(primaryKey.name)}\`")
    private Long ${primaryKey.name};\n\n`
        data.forEach(item => {
            if(item.type === "date" || item.type === "datetime"){
                str += `    /**
     * ${item.remark}
     */
    @${item.updateTime ? "UpdateTime" : item.createTime ? "CreateTime" : ""}
    @TableField("\`${toLine(item.name)}\`")${item.notNull ? "\n    @Required" : ""}
    private String ${item.name};\n\n`
            }else{
                str += `    /**
     * ${item.remark}
     */
    @TableField("\`${toLine(item.name)}\`")${item.createBy ? "\n    @CreateBy" : ""}${item.like ? "\n    @Like" : ""}${item.notNull ? "\n    @Required" : ""}
    private ${item.type} ${item.name};\n\n`
            }
        })
        return str
    }
    return `package com.lia.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.lia.system.crud.anno.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@TableName("${toLine(tableName)}")
public class ${firstUp(toHump(tableName))} {

${columnCode()}}                                   
    `
}



/**
 * 控制层代码生成
 */
export function controllerCode({tableName, httpUrl}) {
    if(httpUrl && httpUrl[0] === '/'){
        httpUrl = httpUrl.substring(1)
    }
    if(httpUrl && httpUrl[httpUrl.length-1] === '/'){
        httpUrl = httpUrl.substring(0,httpUrl.length-1)
    }
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    function getPreAuthorize(method) {
        return httpUrl ? `
    @PreAuthorize("hasAuthority('${httpUrl.split("/").join(':')+":"+method}')")` : ''
    }
    return `package com.lia.server.modules.${objName};

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lia.system.exception.HttpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lia.server.entity.SysRegisterCode;
import java.util.List;

@RestController
${httpUrl ? `@RequestMapping("/${httpUrl}")` : ''}
public class ${className}Controller {


    @Autowired
    private ${className}Service ${objName}Service;


    /**
     * 分页查询
     * @param ${objName} 查询参数
     * @param current 当前页码
     * @param size 每页条数
     * @return PageInfo分页信息
     */
    @PostMapping("/getPage")${getPreAuthorize('getPage')}
    public PageInfo<${className}> get${className}Page(@RequestBody ${className} ${objName}, Integer current, Integer size){
        if(current != null && size != null){
            PageHelper.startPage(current,size);
        }
        return new PageInfo<>(${objName}Service.selectList(${objName}, true));
    }

    /**
     * 新增和编辑
     * 自增主键为空时为新增，否则为编辑
     * @param ${objName} 参数数据
     * @return 操作成功的数量
     */
    @PostMapping("/save")${getPreAuthorize('save')}
    public String save${className}(@RequestBody ${className} ${objName}){
        return ${objName}Service.save(${objName});
    }



    /**
     * 批量删除
     * @param ${objName}Ids 要删除的数据id列表
     * @return 删除成功的数量
     */
    @PostMapping("/delete")${getPreAuthorize('delete')}
    public int delete(@RequestBody List<Integer> ${objName}Ids){
        return ${objName}Service.deleteByIds(${objName}Ids);
    }


}                               
    `
}



/**
 * 业务层代码生成
 */
export function serviceCode({tableName}) {
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    return `package com.lia.server.modules.${objName};

import com.lia.system.crud.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import com.lia.server.entity.SysRegisterCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ${className}Service extends BaseService<${className}> {

    @Autowired
    private ${className}Mapper ${objName}Mapper;


}                                       

    `
}



/**
 * mapper层代码生成
 */
export function mapperCode({tableName}){
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    return `package com.lia.server.modules.${objName};

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lia.server.entity.SysRegisterCode;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ${className}Mapper extends BaseMapper<${className}> {

}                                   
    `
}


export function mybatisCode({data, tableName, primaryKey, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag}){
    data = dataConcat(data, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag)
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    function getResultMap(){
        let str = `
        <id     property="${primaryKey.name}"      column="${toLine(primaryKey.name)}"      />`
        data.forEach(item => {
            str += `
        <id     property="${item.name}"      column="${toLine(item.name)}"      />`
        })
        return str
    }
    return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lia.server.modules.${objName}.${className}Mapper">

    <resultMap type="${className}" id="${className}Result">${getResultMap()}
    </resultMap>

</mapper>`
}


const mysqlMap = {
    String: "varchar",
    Character: "char",
    Integer: "int",
    Long: "bigint",
    Float: "float",
    Double: 'double',
    date: "date",
    datetime: "datetime"
}


/**
 * 生成mysql建表语句
 */
export function mysqlCode({tableName, data, primaryKey, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag}){
    data = dataConcat(data, createByFlag, createTimeFlag, updateTimeFlag, remarkFlag)
    function columnsCode(){
        let columns = []
        columns.push(`
    \`${toLine(primaryKey.name)}\` bigint(0) NOT NULL ${primaryKey.type === "autoIncrement" ? "AUTO_INCREMENT" : ""} COMMENT '主键'`)
        data.forEach(item => {
            columns.push(`
    \`${toLine(item.name)}\` ${mysqlMap[item.type]}(${item.len})${item.createTime || item.updateTime ? " DEFAULT CURRENT_TIMESTAMP(0)" : ""}${item.updateTime ? " ON UPDATE CURRENT_TIMESTAMP(0)" : ""}${["String","Character"].includes(primaryKey.type) ? " CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci" : ""}${item.notNull ? " NOT NULL" : ""} COMMENT '${item.remark}'`)
        })
        columns.push(`
    PRIMARY KEY (\`${toLine(primaryKey.name)}\`) USING BTREE`)
        data.forEach(item => {
            if(item.unique){
                columns.push(`
    UNIQUE INDEX \`${toLine(tableName)}-${toLine(item.name)}\`(\`${toLine(item.name)}\`) USING BTREE`)
            }
        })
        return columns.join(",")
    }
    return `
/*
 Navicat MySQL Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : lia

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: ${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS \`${toLine(tableName)}\`;
CREATE TABLE \`${toLine(tableName)}\`  (${columnsCode()}
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
    `
}