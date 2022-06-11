import './App.css';
import React from "react"
import Home from '@/package/views/home/Home'
import Login from '@/package/views/login/Login'
import Window from '@/package/components/window/Window'
import { Route, Routes } from 'react-router-dom'

class App extends React.Component {

  render() {
    return (
      <Window>
        <Routes>
          <Route exact index path='*' element={<Home />} />
          <Route exact path='/login' element={<Login />} />
        </Routes>
      </Window>
    )
  }
}

export default App
