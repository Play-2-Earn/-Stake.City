import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'
import MapBoxMap from './component/MapboxMap'
function App() {

  const [center, setCenter] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {/* this is the place where all the routes will be added, kindly take a consideration to comments*/}
        </Route>
        <Route path="/explore" element={
          <MapBoxMap
            position={center}
            searchPerformed={false}
            showControls={false}
          />
        }>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
