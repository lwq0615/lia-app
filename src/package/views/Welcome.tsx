import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';


const style = {
  display: 'flex',
  height: '100%',
  justifyContent: "center",
  alignItems: "center"
}


export default function Welcome() {

  const dom: any = useRef(null)
  const color = '#1677ff'
  const text = "Welcome"

  useEffect(() => {
    let myChart = echarts.init(dom.current);
    let option;

    option = {
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: text,
              fontSize: 120,
              fontWeight: 'bold',
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: 'transparent',
              stroke: color,
              lineWidth: 1
            },
            keyframeAnimation: {
              duration: 6000,
              loop: true,
              keyframes: [
                {
                  percent: 0.4,
                  style: {
                    fill: color,
                    lineDashOffset: 200,
                    lineDash: [200, 0]
                  }
                },
                {
                  percent: 0.6,
                  style: {
                    fill: color,
                    lineDashOffset: 200,
                    lineDash: [200, 0]
                  }
                },
                {
                  percent: 0.9,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: 0,
                    lineDash: [0, 200]
                  }
                },
                {
                  percent: 1,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: 0,
                    lineDash: [0, 200]
                  }
                }
              ]
            }
          }
        ]
      }
    };
    option && myChart.setOption(option);
  }, [])

  return (
    <div style={style}>
      <canvas ref={dom} width='700' height='300'></canvas>
    </div>
  )
}