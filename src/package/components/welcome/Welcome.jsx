import { useState, useEffect } from 'react';
import { WordCloud } from '@ant-design/plots';

const Welcome = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/antv-keywords.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data,
    width: 700,
    height: 500,
    autoFit: false,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [8, 32],
      rotation: 0,
    },
    // 返回值设置成一个 [0, 1) 区间内的值，
    // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
    random: () => 0.5,
  };


  const style = {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
  

  return (
    <div style={style}>
      <WordCloud {...config} style={{height: 'auto'}}/>
    </div>
  )
};


export default Welcome
