import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';


export default function AppLoading(props) {

  const dom = useRef(null)
  const color = props.color || '#1677ff'
  const text = props.text || "Loading···"

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
              fontSize: 80,
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
    <div ref={dom} className="lia-loading"></div>
  )
}