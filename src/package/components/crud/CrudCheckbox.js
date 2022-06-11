import React, { useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';


export default function CrudCheckbox(props) {

    const [visible, setVisible] = useState(false);

    let values = props.values

    const hide = () => {
        props.onChange(values)
        setVisible(false)
    }

    return (
        <>
            <Button type="link" onClick={(e) => setVisible(true)}>编辑</Button>
            <Modal
                visible={visible}
                centered={true}
                title={props.column.title}
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