import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
        {/* this is the place where all the routes will be added, kindly take a consideration to comments*/}
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
