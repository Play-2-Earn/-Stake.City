import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'
import MapBoxMap from './component/MapboxMap';
import UserDashboard from './component/user_dash/Dashboard';
function App() {

  const [center, setCenter] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* this is the place where all the routes will be added, kindly take a consideration to comments*/}
        <Route path="/explore" element={
          <MapBoxMap
            position={center}
            searchPerformed={false}
            showControls={false}
          />
        }>
        </Route>

        <Route path="/userdashboard" element={<UserDashboard />}> </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
