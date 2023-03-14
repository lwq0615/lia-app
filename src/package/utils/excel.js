import request from "./request";

export default function excel(heads, data, fileName = "excelData") {
    // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
    const keys = Object.keys(heads)
    const names = Object.values(heads)
    let headStr = names.join(",") + "\n"
    // 增加\t为了不让表格显示科学计数法或者其他格式
    for (let item of data) {
        for (const key of keys) {
            headStr += (item[key] || '') + "\t,";
        }
        headStr += '\n';
    }
    // encodeURIComponent解决中文乱码
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(headStr);
    // 通过创建a标签实现constant林肯=;
    const link = document.createElement("a")
    link.href = uri;
    // 对下载的文件命名
    link.download = fileName + ".csv";
    link.click();
}

const link = document.createElement("a")

/**
 * 从服务器导出excel
 */
export function excelServer(config, name) {
    request({
        ...config,
        responseType: 'blob'
    }).then(res => {
        link.download = name + ".xlsx"
        link.href = window.URL.createObjectURL(new Blob([res]))
        link.click()
    })
}