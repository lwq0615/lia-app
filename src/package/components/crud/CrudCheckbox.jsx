import React, { useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';


export default function CrudCheckbox(props) {

    const [visible, setVisible] = useState(false);

    let values = props.values

    const hide = () => {
        props.onChange(values)
        setVisible(false)
    }

    const show = () => {
        if(props.disabled){
            return
        }
        setVisible(true)
    }

    let style = {}
    if(props.disabled){
        style = {
            cursor: 'no-drop',
            color: 'rgba(0,0,0,0.25)'
        }
    }

    return (
        <>
            <Button type="link" onClick={show} style={style}>编辑</Button>
            <Modal
                open={visible}
                centered={true}
                title={props.column.title}
                className="lia-crud-edit-checkbox-modal"
                okText='确定'
                width={700}
                closable={true}
                onCancel={hide}
                onOk={hide}
            >
                <Checkbox.Group
                    className='checkbox-group'
                    options={props.options}
                    defaultValue={values}
                    onChange={(newVal) => values = newVal}
                />
            </Modal>
        </>
    )
}