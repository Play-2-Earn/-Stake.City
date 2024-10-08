import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './component/Home'
import DropTaskPopup from './component/droptask'
import Explore from './component/Explore'
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
        {/* this is the place where all the routes will be added, kindly take a consideration to comments*/}
        </Route>
        <Route path="/explore" element={
          <Explore />
        }>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
