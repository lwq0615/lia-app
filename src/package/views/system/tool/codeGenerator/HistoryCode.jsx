
import { getCreaterDict } from '@/package/request/system/user'
import Crud from '@/package/components/crud/Crud'
import { getSysToolCodePage, saveSysToolCode, deleteSysToolCodes } from '@/package/request/system/tool/code'
import { Button, message } from "antd"




export default function Code(props) {

    function continueEdit(record) {
        props.close()
        props.setCodeId(record.codeId)
        props.setData(JSON.parse(record.columns))
        props.setHeads([
            {
                "name": [
                    "module"
                ],
                "value": record.module
            },
            {
                "name": [
                    "tableName"
                ],
                "value": record.tableName
            },
            {
                "name": [
                    "primaryKeyType"
                ],
                "value": JSON.parse(record.primaryKey).type
            },
            {
                "name": [
                    "httpUrl"
                ],
                "value": record.httpUrl
            },
            {
                "name": [
                    "CreaterFlag"
                ],
                "value": record.CreaterFlag === '1'
            },
            {
                "name": [
                    "createTimeFlag"
                ],
                "value": record.createTimeFlag === '1'
            },
            {
                "name": [
                    "updateTimeFlag"
                ],
                "value": record.updateTimeFlag === '1'
            },
            {
                "name": [
                    "remarkFlag"
                ],
                "value": record.remarkFlag === '1'
            }
        ])
    }


    const option = {
        // 是否显示行索引，默认true
        showIndex: true,
        // 是否展示右侧操作栏，默认["edit", "delete"]
        rightAction: ["detail", (record) => {
            return (<Button key="continue" type="primary" size='small' onClick={(e) => { continueEdit(record) }}>继续编辑</Button>)
        }, "delete"],
        // 配置按钮组，默认["add", "delete", "search"]
        menuBtns: ["delete", "search"],
        // 表格行是否可选择(默认false)
        selection: true,
        // 触发删除钩子 records => {}
        //return true刷新页面数据
        onDelete: async records => {
            return await deleteSysToolCodes(records.map(item => item.codeId)).then(res => {
                if (res > 0) {
                    message.success("删除成功")
                    return true
                } else {
                    message.error("删除失败")
                    return false
                }
            })
        },
        // 需要加载数据时触发 params => {}
        getPage: (params = {}, page = {}) => {
            params.createTime = params.createTime?.join(",")
            return getSysToolCodePage(params, page.current, page.size)
        },
        // 新增编辑提交钩子 async (form, type) => {}
        // 如果需要获取返回值再关闭弹窗，请使用await
        // return true刷新页面
        onSave: async (form, type) => {
            return await saveSysToolCode(form).then(res => {
                message.success(type + "成功")
                return true
            })
        },
        columns: [
            {
                title: '表格名',
                dataIndex: 'tableName',
                align: 'center',
                key: 'tableName',
                required: true
            },
            {
                title: '字段信息',
                dataIndex: 'columns',
                align: 'center',
                key: 'columns',
                required: true,
                search: false,
                hideText: true
            },
            {
                title: '主键信息',
                dataIndex: 'primaryKey',
                align: 'center',
                key: 'primaryKey',
                required: true,
                search: false,
                hideText: true
            },
            {
                title: '接口地址',
                dataIndex: 'httpUrl',
                align: 'center',
                key: 'httpUrl',
                required: false
            },
            {
                title: '创建人',
                dataIndex: 'creater',
                align: 'center',
                key: 'creater',
                addShow: false,
                editShow: false,
                type: "select",
                dict: getCreaterDict
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                key: 'createTime',
                addShow: false,
                editShow: false,
                type: 'datetime',
                // 开启范围搜索,只在type为date或datetiime时生效(默认false)
                range: true,
                //该列在搜索框所占宽度，最大24,默认6
                span: 8
            },
        ]
    }


    return (
        <Crud {...option}/>
    )
}          
