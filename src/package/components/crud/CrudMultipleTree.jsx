import { Modal, Button, Tree } from 'antd';
import {useState} from 'react';

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

    const show = () => {
        if(props.disabled){
            return
        }
        setVisible(true)
    }

    const onCheck = (checkedKeys) => {
        props.onChange(checkedKeys.checked)
    };
    const treeData = treeMap(props.treeData)
    let values = props.values
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