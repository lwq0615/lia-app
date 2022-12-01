import Crud from '@/package/components/crud/Crud'
import { getSysDictDataPage, saveSysDictData, deleteSysDictDatas } from '@/package/request/system/dictData'
import { getCreateByDict } from '@/package/request/system/user'
import { message } from "antd"


export default function SysDictData(props) {

    const option = {
        // 是否显示行索引，默认true
        showIndex: true,
        // 是否展示右侧操作栏，默认["edit", "delete"]
        rightAction: true,
        menuBtns: ["add", "delete", "search"],
        // 表格行是否可选择(默认false)
        selection: true,
        // 触发删除钩子 records => {}
        //return true刷新页面数据
        onDelete: async records => {
            return await deleteSysDictDatas(records.map(item => item.dataId)).then(res => {
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
            params.typeId = props.typeId
            params.createTime = params.createTime?.join(",")
            return getSysDictDataPage(params, page.current, page.size)
        },
        // 新增编辑提交钩子 async (form, type) => {}
        // 如果需要获取返回值再关闭弹窗，请使用await
        // return true刷新页面
        onSave: async (form, type) => {
            form.typeId = props.typeId
            return await saveSysDictData(form).then(res => {
                if (res === 'error') {
                    message.warning("未知错误")
                    return false
                } else if (res === 'success') {
                    message.success(type + "成功")
                    return true
                } else {
                    message.warning(res)
                    return false
                }
            })
        },
        columns: [
            {
                title: 'value',
                dataIndex: 'value',
                align: 'center',
                key: 'value',
                required: true
            },
            {
                title: '标签',
                dataIndex: 'label',
                align: 'center',
                key: 'label',
                required: true
            },
            {
                title: '创建人',
                dataIndex: 'createBy',
                align: 'center',
                key: 'createBy',
                addShow: false,
                editShow: false,
                type: "select",
                dict: getCreateByDict
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
            {
                title: '备注',
                dataIndex: 'remark',
                align: 'center',
                key: 'remark',
                hideText: true,
                required: false
            }
        ]
    }


    return (
        <Crud {...option} />
    )
}          