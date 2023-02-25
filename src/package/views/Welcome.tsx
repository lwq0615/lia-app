import { Liquid } from '@ant-design/plots';
import { useEffect, useState } from 'react';


const style = {
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}


export default function DemoLiquid() {

  const [percent, setPercent] = useState<number>(0)

  const config = {
    percent: percent,
    autoFit: true,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
  };
  return (
    <div style={style}>
      <Liquid {...config} />
    </div>
  )
};

