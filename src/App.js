import './App.css';
import React from "react"
import Home from '@/package/views/home/Home'
import Login from '@/package/views/login/Login'
import Window from '@/package/components/window/Window'
import { Route, Routes } from 'react-router-dom'
import WithRouter from '@/package/components/hoc/WithRouter';

class App extends React.Component {

  constructor(props){
      super(props)
      window.navigate = props.navigate
  }

  render() {
    return (
      <Window>
        <Routes>
          <Route exact index path='*' element={<Home />} />
          <Route exact index path='/login' element={<Login />} />
        </Routes>
      </Window>
    )
  }
}

export default WithRouter(App)
