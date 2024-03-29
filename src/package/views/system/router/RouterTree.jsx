import React from 'react';
import { Button, Tree, Input, message } from 'antd';
import './router.scss'
import { reloadIndex, saveSysRouter } from '@/package/request/system/router';


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

  onDrop = (e) => {
    const findRouter = (routerId, routers = this.props.routerTree) => {
      if (Array.isArray(routers)) {
        for (const i in routers) {
          const item = routers[i]
          if (item.routerId === routerId) {
            return routers.splice(i, 1)[0]
          }
          if (Array.isArray(item.children)) {
            const res = findRouter(routerId, item.children)
            if(res){
              return res
            }
          }
        }
      }
    }
    // 被拖动元素
    const dragRouter = findRouter(e.dragNode.key)
    // 移动目标位置元素
    const toNodeKey = e.node.key
    // 是否作为目标元素的下一级的第一个
    const nextFlg = e.node.dragOver
    // 是否在目标元素上方
    const toNodeTop = e.node.dragOverGapTop
    // 需要重新排序的路由数组
    let reIndexArray = null
    // 任务队列
    const task = []
    // 移动路由元素到目标数组
    const insert = (routers = this.props.routerTree, parent) => {
      if (Array.isArray(routers)) {
        for (const i in routers) {
          const item = routers[i]
          // 找到目标路由所在位置
          if (item.routerId === toNodeKey) {
            reIndexArray = routers
            let parentId = parent?.routerId || 1
            // 插入目标路由子路由的首位
            if (nextFlg) {
              parentId = item.routerId
              if (!Array.isArray(item.children)) {
                item.children = []
              }
              reIndexArray = item.children
              item.children.unshift(dragRouter)
            }
            // 插入目标路由的前方
            else if (toNodeTop) {
              routers.splice(i, 0, dragRouter)
            }
            // 插入目标路由的后方
            else {
              routers.splice(+i + 1, 0, dragRouter)
            }
            if (dragRouter.parent !== parentId) {
              dragRouter.parent = parentId
              task.push(saveSysRouter(dragRouter))
            }
            return
          }
          if (Array.isArray(item.children)) {
            insert(item.children, item)
          }
        }
      }
    }
    insert()
    // 重新排序
    const newIndex = []
    if (Array.isArray(reIndexArray)) {
      for (const i in reIndexArray) {
        newIndex[i] = reIndexArray[i].routerId
      }
    }
    task.push(reloadIndex(newIndex))
    Promise.all(task).then(res => {
      message.success("操作成功")
      this.props.reloadTree()
    })
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
          style={{ paddingTop: 10 }}
          showLine={{
            showLeftIcon: true
          }}
          draggable={{ icon: false }}
          onDrop={this.onDrop}
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