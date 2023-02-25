import { OrganizationGraph } from '@ant-design/graphs';
import { getSysRolePage } from '@/package/request/system/role'
import { useEffect, useState } from 'react';

export default function Diagram(props){
  const [data, setData] = useState()

  useEffect(() => {
    getSysRolePage({ companyId: props.companyId }).then(res => {
      const comp = {
        id: 'c:'+props.companyId,
        value: {
          name: props.companyName
        },
        children: []
      }
      res.list.forEach(child => {
        // 如果该角色的上级是自己或者为空，说明这是最上层角色
        if (child.superior === child.roleId || child.superior === null || child.superior === void 0) {
          comp.children.push(child)
          return
        }
        for (let superior of res.list) {
          if (child.superior === superior.roleId) {
            if (!Array.isArray(superior.children)) superior.children = []
            superior.children.push(child)
            return
          }
        }
      })
      res.list.forEach(item => {
        item.id = ""+item.roleId
        item.value = {
          name: item.name
        }
      })
      setData(comp)
    })
  }, [])

  const getTextAttrs = () => {
    return {
      fontSize: 16,
      fill: '#fff',
    };
  };
  const getNodeStyle = () => {
    return {
      fill: '#1E88E5',
      stroke: '#1E88E5',
      radius: 5,
    };
  };

  const calcStrLen = function calcStrLen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  };

  const config = {
    nodeCfg: {
      size: [40, 40],
      autoWidth: true,
      padding: 10,
      style: (item) => {
        const { level } = item.value;
        return {
          fill: 'transparent',
          stroke: 'transparent',
          radius: 4,
          cursor: 'pointer',
          ...getNodeStyle()
        };
      },
      nodeStateStyles: {
        hover: {
          lineWidth: 2,
          stroke: '#96DEFF',
        },
      },
      label: {
        style: (cfg, group, type) => {
          const { href } = cfg.value;

          if (type !== 'name') {
            return {};
          }
          return {
            fontSize: 16,
            cursor: 'pointer',
            fill: href ? '#1890ff' : '#000',
            ...getTextAttrs()
          };
        },
      },
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
    edgeCfg: {
      type: 'polyline',
      style: {
        stroke: '#000',
        endArrow: false,
      },
    },
    markerCfg: (cfg) => {
      const { direction } = cfg.value;
      return {
        position: direction,
        show: true
      };
    },
    layout: {
      type: 'mindmap',
      direction: 'H',
      getWidth: (cfg) => {
        const { name } = cfg.value;
        const fontSize = 16;
        const width = (fontSize * calcStrLen(name)) / 2;
        return width;
      },
      getHeight: () => {
        return 25;
      },
      getVGap: () => {
        return 20;
      },
      getHGap: () => {
        return 40;
      },
      getSide: (d) => {
        return d.data.value.direction === 'left' ? 'left' : 'right';
      },
    },
    autoFit: true,
    fitCenter: true,
    animate: false,
    behaviors: ['drag-canvas', 'zoom-canvas'],
    onReady: (graph) => {
      graph.on('node:click', (evt) => {
        const { item, target } = evt;
        const { value } = item.get('model');
        if (value.href) {
          window.open(value.href);
        }
      });
    },
  };
  return data ? <OrganizationGraph {...config} data={data} /> : null
};

