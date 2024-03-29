import React from "react";
import { Popconfirm, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';


const CrudConfirm = (props) => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const showPopconfirm = (e) => {
        if(props.before && !props.before()){
            return
        }
        const records = [...props.nodes?.crudTableRef?.state?.selectedRows]
        if(props.deleteClick) props.deleteClick(records)
        e.stopPropagation()
        setVisible(true);
    };

    const handleOk = async (e) => {
        e.stopPropagation()
        setConfirmLoading(true);
        await props.deleteSubmit()
        setVisible(false);
        setConfirmLoading(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation()
        setVisible(false);
    };

    return (
        <Popconfirm
            title={props.msg || "确定删除？"}
            open={visible}
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            {
                props.type === 'default'
                ? <Button type="primary" icon={<DeleteOutlined />} danger onClick={showPopconfirm}>删除</Button>
                : <Button type="primary" danger size={props.size || 'small'} onClick={showPopconfirm}>删除</Button>
            }
        </Popconfirm>
    );
};

export default CrudConfirm