
import React from "react"
import { MinusOutlined, CloseOutlined, BorderOutlined, SwitcherOutlined } from '@ant-design/icons';
import tiantianquan from './tiantianquan.png'
import './window.scss'

class Window extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      max: false,
      style: {
        borderRadius: 5
      }
    }
    ipcRenderer.on('max', (event) => {
      this.setState({
        max: true,
        style: {
          borderRadius: 0
        }
      })
    });
    ipcRenderer.on('unmax', (event) => {
      this.setState({
        max: false,
        style: {
          borderRadius: 5
        }
      })
    })
  }

  min = () => {
    window.ipcRenderer.send("min")
  }

  max = () => {
    window.ipcRenderer.send("max")
  }

  close = () => {
    window.ipcRenderer.send("close")
  }

  render() {
    return (
      <section className='window'>
        <div className="window-body">
          <div className='app-btns'>
            <img src={tiantianquan} className='logo' />
            <div className='drag'></div>
            <MinusOutlined className='min' onClick={this.min}></MinusOutlined>
            {
              this.state.max
                ? <SwitcherOutlined className='max' onClick={this.max}></SwitcherOutlined>
                : <BorderOutlined className='max' onClick={this.max}></BorderOutlined>
            }
            <CloseOutlined className='close' onClick={this.close}></CloseOutlined>
          </div>
          <div className='container'>
            {this.props.children}
          </div>
        </div>
      </section>
    )
  }
}

export default Window
