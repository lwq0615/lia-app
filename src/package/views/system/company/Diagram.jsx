import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import { getSysRolePage } from '@/package/request/system/role'

//十六进制颜色随机
function color16(){
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  return color;
}

export default function Diagram(props) {

  useEffect(() => {
    let chartDom = document.getElementById('diagram');
    let myChart = echarts.init(chartDom);
    let option;
    myChart.showLoading();
    getSysRolePage({ companyId: props.companyId }).then(res => {
      const roleList = []
      res.list.forEach(child => {
        // 如果该角色的上级是自己，说明这是最上层角色
        if (child.superior === child.roleId) {
          roleList.push(child)
          return
        }
        for (let superior of res.list) {
          if (child.superior === superior.roleId) {
            if (!Array.isArray(superior.children)) superior.children = []
            superior.children.push(child)
            return
          }
        }
        // 找不到上级角色，说明这是最上层角色
        roleList.push(child)
      })
      const selected = {}
      roleList.forEach(item => {
        if(roleList.indexOf(item) === 0){
          selected[item.name] = true
        }else{
          selected[item.name] = false
        }
      })
      myChart.setOption(
        (option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          legend: {
            top: '2%',
            left: '3%',
            orient: 'vertical',
            data: roleList.map(item => {
              return {
                name: item.name,
                icon: 'rectangle',
                itemStyle: {
                  color: color16()
                }
              }
            }),
            selected,
            borderColor: '#c23531'
          },
          series: roleList.map(item => {
            return {
              type: 'tree',
              name: item.name,
              data: [item],
              top: '5%',
              left: '7%',
              bottom: '2%',
              right: '10%',
              symbolSize: 15,
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 14,
                backgroundColor: 'white',
                padding: 5
              },
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              emphasis: {
                focus: 'descendant'
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750,
              initialTreeDepth: -1
            }
          })
        })
      );
      console.log(option);
      option && myChart.setOption(option);
      myChart.hideLoading();
    })
  }, [])
  return (
    <canvas id='diagram' width="900" height="400"></canvas>
  )
}
