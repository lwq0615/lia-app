# Crud组件


:::tip 提示
lia-app提供了Crud组件，组件提供了很多个性化接口，只需要使用代码生成功能生成模板代码，再对模板做少量个性化修改，即可快速构建增删改查模块
:::

#### Crud组件相关配置
| 参数 | 说明 | 类型 | 是否必填 | 默认值 |
| ---  | --- | ---  | ---      | ---   |
| tableName | 表格名称 | String | 否 | -- |
| getPage | 根据条件查询与分页参数return一个PageHelper封装的结果集 | function(params, page) | 是 | -- |
| onSave | 新增或编辑数据方法，return true刷新页面 | function(record) | 否 | -- |
| onDelete | 删除数据方法，return true刷新页面 | function(records) | 否 | -- |
| columns | 表格字段配置，详情请查看column配置 | Array | 是 | -- |
| selection | 是否允许选中行数据 | bool | 否 | false |
| showIndex | 展示行索引 | bool | 否 | true |
| rightAction | 是否展示右侧操作栏，可以在数组中添加自定义方法return一个可渲染节点 | bool, Array | 否 | ["edit", "delete"] |
| menuBtns | 配置显示的按钮，可以在数组中添加自定义方法return一个可渲染节点 | bool, Array | 否 | ["add", "delete", "search", "excel"] |
| onSelection | 表格选中项改变 | function(selectedRowKeys<br/>,selectedRows) | 否 | -- |
| onRowClick | 点击表格行 | function(record, event) | 否 | -- |
| editClick | 点击编辑按钮，return false时取消默认编辑弹窗 | function(record) | 否 | -- |
| deleteClick | 点击删除 | function(records) | 否 | -- |
| addClick | 点击新增按钮，return false时取消默认新增弹窗 | function | 否 | -- |
| showSearch | 条件查询 | bool | 否 | true |
| deleteMsg | 点击删除时提示的文字 | string | 否 | "确定删除？" |


#### column配置
| 参数 | 说明 | 类型 | 是否必填 | 默认值 |
| ---  | --- | ---  | ---      | ---   |
| defaultValue | 新增时的默认值 | any | 否 | -- |
| addShow | 新增时是否展示该字段 | bool | 否 | true |
| editShow | 编辑时是否展示该字段 | bool | 否 | true |
| editEnable | 编辑时是否允许编辑字段 | bool | 否 | true |
| required | 该字段是否必填 | bool | 否 | false |
| placeholder | 值为空时的提示信息 | String | 否 | -- |
| nullValue | 值为空时该字段在表格内展示的数据 | Node | 否 | -- |
| show | 在表格内是否显示该列，不影响新增和编辑 | bool | 否 | true |
| search | 是否开启该字段条件查询 | bool | 否 | true |
| html | return一个可渲染的元素自定义表格中该字段展示的内容 | function(text) | 否 | -- |
| span | 该列在搜索框所占宽度，最大24 | number | 否 | 6 |
| hideText | 是否隐藏文本，通过点击按钮展开 | bool | 否 | false |
| type | 字段类型，默认为文本类型 | date,datetime,select,<br/>textarea,icon,number,<br/>multipleTree,tree,<br/>checkbox,switch | 否 | -- |
| dict | 与type配合使用，type为select,multipleTree,tree,checkbox时需要配置dict | array,function,Promise | 否 | -- |


:::tip 提示
dict可以直接定义一个数组，或者给定一个function，return一个列表（允许是Promise），type为switch时dict应该是长度为二的列表，元素1为开关打开的状态，元素2为开关关闭的状态，不给定dict时默认为true和false，列表内数据类型为后端SysDictData类型
:::

:::tip 提示
CrudTable组件依赖于antd组件库Table组件，antd组件库Table组件中Column的配置均可使用
:::