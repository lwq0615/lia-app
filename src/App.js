import './App.css';
import React from "react"
import Home from '@/package/views/home/Home'
import Login from '@/package/views/login/Login'
import { Route, Routes } from 'react-router-dom'

class App extends React.Component {

  render() {
    return (
      <Routes>
        <Route exact index path='*' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
    )
  }
}

export default App
