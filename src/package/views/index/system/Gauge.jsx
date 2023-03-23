import { Gauge } from '@ant-design/plots';

export default function DemoGauge(props) {
  let color = '#30BF78'
  if(props.percent > 40){
    color = '#faad14'
  }
  if(props.percent > 70){
    color = '#ff4d4f'
  }
  const config = {
    width: 250,
    percent: parseFloat((props.percent / 100).toFixed(2)) || 0,
    radius: 0.8,
    range: {
      color: color,
      width: 12,
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        formatter: ({ percent }) => `${props.name}: ${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 16,
        },
      },
    },
    gaugeStyle: {
      lineCap: 'round',
    },
  };
  return <Gauge {...config} />;
};

