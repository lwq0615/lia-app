
import React from "react"
import { MinusOutlined, CloseOutlined, BorderOutlined, SwitcherOutlined } from '@ant-design/icons';
import './window.scss'

class Window extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      max: false
    }
    ipcRenderer.on('max', (event) => {
      this.setState({
        max: true
      })
    });
    ipcRenderer.on('unmax', (event) => {
      this.setState({
        max: false
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
      <section className='body' style={this.props.style}>
        <div className='app-btns'>
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
      </section>
    )
  }
}

export default Window
