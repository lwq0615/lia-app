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
        props.onChange(checkedKeys)
    };
    const treeData = treeMap(props.treeData)
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
                width={600}
                closable={true}
                onCancel={hide}
                footer={
                    <Button type='primary' onClick={hide}>确定</Button>
                }
            >
                <Tree
                    className='multiple-tree'
                    checkable
                    checkStrictly={props.checkStrictly}
                    checkedKeys={props.value}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </>
    )
};


MultipleTree.propTypes = {
    value: propTypes.array,
    checkStrictly: propTypes.bool,
    disabled: propTypes.bool,
    title: propTypes.node,
    treeData: propTypes.array.isRequired
}

export default MultipleTree;