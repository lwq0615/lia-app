import { Modal, Button, Tree, Input } from 'antd';
import { useState } from 'react';
import './css/multipleTree.scss'
import propTypes from 'prop-types'

const dataList = []
function generateList(data) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({
      key,
      title
    });

    if (node.children) {
      generateList(node.children);
    }
  }
};

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

  const [searchValue, setSearchValue] = useState('')
  const [expandedKeys, setExpandedKeys] = useState([])
  const [visible, setVisible] = useState(false);

  const treeData = treeMap(props.treeData)
  generateList(treeData)

  const getParentKey = (key, tree) => {
    let parentKey;

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];

      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onChange = (e) => {
    const { value } = e.target;
    let newExpandedKeys = []
    if (value) {
      newExpandedKeys = dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
    }
    setSearchValue(value)
    setExpandedKeys(newExpandedKeys)
  };

  const loop = (data) => {
    if (!data) {
      return null
    }
    return data.map((item) => {
      const strTitle = item.title;
      const index = strTitle.indexOf(searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      return {
        ...item,
        title,
        key: item.key,
        children: loop(item.children),
      };
    });
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
        {
          props.searchAble && <Input
            style={{
              marginBottom: 8,
            }}
            placeholder="搜索"
            onChange={onChange}
          />
        }
        <Tree
          className='multiple-tree'
          checkable
          checkStrictly={props.checkStrictly}
          checkedKeys={props.value}
          onExpand={(newExpandedKeys) => setExpandedKeys(newExpandedKeys)}
          expandedKeys={expandedKeys}
          onCheck={(checkedKeys) => props.onChange(checkedKeys)}
          treeData={loop(treeData)}
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
  treeData: propTypes.array.isRequired,
  searchAble: propTypes.bool
}

export default MultipleTree;