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
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
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
 * 实体类代码生成
 */
export function entityCode(data, tableName, primaryKey) {
    const columnCode = () => {
        let str = `    private Long ${primaryKey.name};\n`
        data.forEach(item => {
            str += `    private ${item.type} ${item.name};\n`
        })
        return str
    }
    return `
package com.lia.server.moudles.${firstUp(toHump(tableName))};

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ${firstUp(toHump(tableName))} {

${columnCode()}
}                                   
    `
}



/**
 * 控制层代码生成
 */
export function controllerCode(data, tableName, httpUrl) {
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
    function requireCode(){
        let str = ``
        data.forEach(item => {
            if(item.notNull){
                let name = item.name
                str += `if(${objName}.get${firstUp(name)}() == null${item.type === 'String' ? ` || ${objName}.get${firstUp(name)}().equals("")` : ''}){
            throw new HttpException(400,"缺少参数${name}");
        }
        `
            }
        })
        return str
    }
    return `
package com.lia.server.modules.${objName};

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lia.server.entity.${className};
import com.lia.system.exception.HttpException;
import com.lia.server.service.${className}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
        return new PageInfo<>(${objName}Service.find${className}(${objName}));
    }

    /**
     * 新增和编辑
     * 自增主键为空时为新增，否则为编辑
     * @param ${objName} 参数数据
     * @return 操作成功的数量
     */
    @PostMapping("/save")${getPreAuthorize('save')}
    public String save${className}(@RequestBody ${className} ${objName}){
        ${requireCode()}return ${objName}Service.save${className}(${objName});
    }



    /**
     * 批量删除
     * @param ${objName}Ids 要删除的数据id列表
     * @return 删除成功的数量
     */
    @PostMapping("/delete")${getPreAuthorize('delete')}
    public int delete(@RequestBody List<Integer> ${objName}Ids){
        return ${objName}Service.delete${className}s(${objName}Ids);
    }


}                               
    `
}



/**
 * 业务层代码生成
 */
export function serviceCode(tableName, primaryKey) {
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    function setPrimaryKey(){
        if(primaryKey.type === "autoIncrement"){
            return ``
        }else{
            return `
                ${objName}.set${firstUp(toHump(primaryKey.name))}(SnowflakeId.nextId());`
        }
    }
    return `
package com.lia.server.modules.${objName};

import com.lia.server.entity.${className};
import com.lia.server.mapper.${className}Mapper;
import com.lia.system.security.LoginUser;
import com.lia.system.utils.SnowflakeId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ${className}Service {


    @Autowired
    private ${className}Mapper ${objName}Mapper;


    /**
     * 分页查询
     * @param ${objName}
     * @return
     */
    public List<${className}> find${className}(${className} ${objName}) {
        return ${objName}Mapper.find${className}(${objName});
    }


    /**
     * 新增或编辑
     *
     * @param ${objName}
     * @return
     */
    public String save${className}(${className} ${objName}) {
        int success = 0;
        try {
            if (${objName}.get${firstUp(primaryKey.name)}() == null) {
                // 新增${setPrimaryKey()}
                success = ${objName}Mapper.add${className}(${objName});
            } else {
                // 编辑
                success = ${objName}Mapper.edit${className}(${objName});
            }
        } catch (DuplicateKeyException e) {
            String[] split = e.getCause().getMessage().split(" ");
            String replace = split[split.length - 1].replace("'", "");
            String name = replace.split("\\\\.")[1].split("-")[1];
            return name + "重复";
        }
        return success > 0 ? "success" : "error";
    }


    /**
     * 批量删除
     *
     * @param ${objName}Ids id列表
     * @return 删除成功的数量
     */
    public int delete${className}s(List<Integer> ${objName}Ids) {
        if (${objName}Ids.size() == 0) {
            return 0;
        }
        return ${objName}Mapper.delete${className}s(${objName}Ids);
    }

}                                       

    `
}



/**
 * mapper层代码生成
 */
export function mapperCode(tableName){
    const className = firstUp(toHump(tableName))
    const objName = firstLow(toHump(tableName))
    return `
package com.lia.server.modules.${objName};

import com.lia.server.entity.${className};
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ${className}Mapper {


    /**
     * 条件查询
     * @param ${objName} 查询参数
     * @return 查询结果列表
     */
    List<${className}> find${className}(${className} ${objName});


    /**
     * 新增
     * @param ${objName}
     * @return
     */
    int add${className}(${className} ${objName});


    /**
     * 编辑
     * @param ${objName}
     * @return
     */
    int edit${className}(${className} ${objName});


    /**
     * 批量删除
     * @param ${objName}Ids
     * @return
     */
    int delete${className}s(List<Integer> ${objName}Ids);

}                                   
    `
}


export function mybatisCode(data, tableName, primaryKey){
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
    function getWhereCode(){
        let str = `
            <if test="${primaryKey.name} != null">
                AND \`${toLine(primaryKey.name)}\` = #{${primaryKey.name}}
            </if>`
        data.forEach(item => {
            str += `
            <if test="${item.name} != null">
                AND \`${toLine(item.name)}\` = #{${item.name}}
            </if>`
        })
        return str
    }
    function insertCode(){
        let str = `(`
        let columns = []
        if(primaryKey.type === "snowflake"){
            columns.push(toLine(primaryKey.name))
        }
        data.forEach(item => {
            columns.push(toLine(item.name))
        })
        str += columns.map(item => "`"+item+"`").join(",")+`) values (`
        str += columns.map(item => `
            #{${toHump(item)}}`).join(",")
        return str+")"
    }
    function updateCode(){
        return data.map(item => `
        \`${toLine(item.name)}\` = #{${toHump(item.name)}}`).join(",")
    }
    return `
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lia.server.mapper.${className}Mapper">

    <resultMap type="${className}" id="${className}Result">${getResultMap()}
    </resultMap>


    <select id="find${className}" parameterType="${className}" resultMap="${className}Result">
        select * from ${toLine(tableName)}
        <where>${getWhereCode()}
        </where>
    </select>


    <insert id="add${className}" parameterType="${className}">
        insert  into ${toLine(tableName)}
        ${insertCode()}
    </insert>


    <update id="edit${className}" parameterType="${className}">
        update ${toLine(tableName)} set ${updateCode()}
        where \`${toLine(primaryKey.name)}\` = #{${toHump(primaryKey.name)}}
    </update>

    <delete id="delete${className}s" parameterType="List">
        delete from ${toLine(tableName)} where ${toLine(primaryKey.name)} in
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <foreach collection="${objName}Ids" index="index" item="item">
                #{item},
            </foreach>
        </trim>
    </delete>

</mapper>                                   
    `
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
export function mysqlCode(tableName,data,primaryKey){
    function columnsCode(){
        let columns = []
        columns.push(`
    \`${toLine(primaryKey.name)}\` bigint(0) NOT NULL ${primaryKey.type === "autoIncrement" ? "AUTO_INCREMENT" : ""} COMMENT '主键'`)
        data.forEach(item => {
            columns.push(`
    \`${toLine(item.name)}\` ${mysqlMap[item.type]}(${item.len}) ${["String","Character"].includes(primaryKey.type) ? "CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci" : ""} ${item.notNull ? "NOT NULL" : ""} COMMENT '${item.remark}'`)
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