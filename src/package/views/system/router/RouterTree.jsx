import React from 'react';
import { Button, Tree, Input } from 'antd';
import './router.scss'


function routerMap(routers) {
  if (!routers) {
    return null
  }
  return routers.map(router => {
    return {
      title: router.label,
      key: router.routerId,
      children: routerMap(router.children)
    }
  })
}

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

class RouterTree extends React.Component {

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    defaultData: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const data = routerMap(nextProps.routerTree)
    generateList(data)
    return {
      defaultData: data
    }
  }

  getParentKey = (key, tree) => {
    let parentKey;

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];

      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }

    return parentKey;
  };

  onExpand = (newExpandedKeys) => {
    this.setState({
      expandedKeys: newExpandedKeys,
      autoExpandParent: false
    })
  };

  onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.key, this.state.defaultData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys: newExpandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  };

  onSelect = (keys, e) => {
    this.props.onSelect(e.node.key, keys)
  }

  loop = (data) => {
    if (!data) {
      return null
    }
    return data.map((item) => {
      const strTitle = item.title;
      const index = strTitle.indexOf(this.state.searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + this.state.searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{this.state.searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );

      return {
        title,
        key: item.key,
        children: this.loop(item.children),
      };
    });
  }

  render() {
    return (
      <div className='system-router-tree' style={this.props.style}>
        <div className='option'>
          {
            this.props.addButton
              ? <Button type="primary" className='addBtn' onClick={() => this.props.addClick()}>新增</Button>
              : null
          }
          {
            this.props.search !== false
              ? <Input
                style={{
                  marginBottom: 8,
                }}
                placeholder="搜索"
                onChange={this.onChange}
              />
              : null
          }

        </div>
        <Tree
          showLine={{
            showLeftIcon: true
          }}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          treeData={this.loop(this.state.defaultData)}
        />
      </div>
    );
  }


}

export default RouterTree;