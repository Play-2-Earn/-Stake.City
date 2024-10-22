import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'
import UserDashboard from './component/user_dash/Dashboard';
import ReleaseStake from './component/release_stakes';
import Explore from './component/Explore'
function App() {

  const [center, setCenter] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />}></Route>
        <Route path="/:q_id" element={<Home />}></Route>
        {/* this is the place where all the routes will be added, kindly take a consideration to comments*/}
        <Route path="/explore" element={
          <Explore />
        }>
        </Route>
        <Route path="/explore/:q_id" element={<Explore />} />
        <Route path="/userdashboard" element={<UserDashboard />}> </Route>
        <Route path="/releaseStake" element={<ReleaseStake />}> </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
