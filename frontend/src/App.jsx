import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'
import UserDashboard from './component/user_dash/Dashboard';
import ReleaseStake from './component/release_stakes';
import Explore from './component/Explore'
import LeaderBoard from './component/Leaderboard/LeaderBoard';
import ContactUs from './component/Contactus';
import { useSelector } from 'react-redux';
import AlertMessage from '../../frontend/src/component/explore/AlertMessage';

function App() {
  const { openAlert } = useSelector((state) => state.alertState)
  const [center, setCenter] = useState(null);

  return (
    <>
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
          <Route path='/leaderboard' element={<LeaderBoard />} />
          <Route path="/userdashboard" element={<UserDashboard />}> </Route>
          <Route path="/releaseStake" element={<ReleaseStake />}> </Route>
          <Route path="/contactus" element={<ContactUs />}> </Route>
        </Routes>
      </BrowserRouter>

      {/* Alert - Action Message */}
      {openAlert && <AlertMessage />}
    </>
  )
}

export default App
