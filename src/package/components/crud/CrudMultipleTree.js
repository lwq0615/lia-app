import { Modal, Button, Tree } from 'antd';
import React, {useState} from 'react';

function treeMap(tree){
    if(!tree){
        return null
    }
    return tree.map(item => {
        return Object.assign({...item},{
            title: item.label,
            key: item.value,
            children: treeMap(item.children)
        })
    })
}

const App = (props) => {

    const [visible, setVisible] = useState(false);

    const hide = () => {
        setVisible(false)
    }

    const onCheck = (checkedKeys) => {
        props.onChange(checkedKeys.checked)
    };
    const treeData = treeMap(props.treeData)
    let values = props.values

    return (
        <>
            <Button type="link" onClick={(e) => setVisible(true)}>编辑</Button>
            <Modal
                visible={visible}
                centered={true}
                title={props.column.title}
                okText='确定'
                width={600}
                closable={true}
                onCancel={hide}
                onOk={hide}
            >
                <Tree
                    className='multiple-tree'
                    checkable
                    checkStrictly
                    defaultCheckedKeys={values}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </>
    )
};

export default App;