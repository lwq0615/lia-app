import { Modal, Button, Tree } from 'antd';
import { useState } from 'react';
import propTypes from 'prop-types'


function treeMap(tree) {
    if (!tree) {
        return null
    }
    return tree.map(item => {
        return Object.assign({ ...item }, {
            title: item.label,
            key: item.value,
            children: treeMap(item.children)
        })
    })
}


const MultipleTree = (props) => {

    const [visible, setVisible] = useState(false);
    let checkeds = []

    const ok = () => {
        props.onChange(checkeds)
        setVisible(false)
    }

    const hide = () => {
        setVisible(false)
    }

    const show = () => {
        if (props.disabled) {
            return
        }
        setVisible(true)
    }

    const onCheck = (checkedKeys) => {
        checkeds = checkedKeys
    };
    const treeData = treeMap(props.treeData)
    let values = props.defaultValues
    let style = {}
    if (props.disabled) {
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
                title={props.title}
                okText='确定'
                width={600}
                closable={true}
                onCancel={hide}
                onOk={ok}
            >
                <Tree
                    className='multiple-tree'
                    checkable
                    checkStrictly={props.checkStrictly}
                    defaultCheckedKeys={values}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </>
    )
};


MultipleTree.propTypes = {
    defaultValues: propTypes.array,
    checkStrictly: propTypes.bool,
    disabled: propTypes.bool,
    title: propTypes.node,
    treeData: propTypes.array.isRequired
}

export default MultipleTree;