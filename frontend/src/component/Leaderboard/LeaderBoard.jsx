import React, { useEffect, useState } from 'react'
import '../styles/LeaderBoard.css'
import UserRow from './UserRow';
import axios from 'axios';
import Loader from './Loader';
import Header from '../header';
import Footer from '../footer';

const LeaderBoard = () => {
  const [active, setActive] = useState('weekly');
  const [players, setPlayers] = useState(undefined);
  const [load, setLoad] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('user') ? true : false);


  useEffect(() => {
    const getPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get_all_users_sorted');
        console.log(response.data.users);
        // Ensure that the data is an array, or set an empty array as fallback
        setPlayers(response.data.users);
        setLoad(false);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    getPlayers();
  }, []);

  const showRank = () => {
    const container = document.querySelector('.containerr > .leaderbody > .leaderlist');
    const child = container.querySelector('.currentuser');
    const targetScroll = child.offsetTop - 60;
    const speed = 1; // Lower value means faster scrolling

    const scrollAnimation = () => {
      const currentScroll = container.scrollTop;
      const distance = targetScroll - currentScroll;

      if (Math.abs(distance) < 1) {
        container.scrollTop = targetScroll; // Snap to the target position
        return;
      }

      const step = distance / speed; // Adjust the step size based on speed
      container.scrollTop += step;

      requestAnimationFrame(scrollAnimation); // Recursively call for smooth animation
    };

    scrollAnimation();
  };

  const hide = { visibility: 'hidden' }
  const showw = { visibility: 'visible' }


  return (
    <>
      <div className='containerr'>
        <Header />
        <div className='head'>
          <div className='west'>
            <h1>Top Leaderboard</h1>
            <div className='radio'>
              <div className={active === 'weekly' ? 'active' : 'item'} onClick={() => setActive('weekly')}>
                <p>Weekly</p>
              </div>
              <div className={active === 'monthly' ? 'active' : 'item'} onClick={() => setActive('monthly')}>
                <p>Monthly</p>
              </div>
            </div>
          </div>
        </div>
        <div className='leaderbody'>
          <div className='leaderlist'>
            {load ? <Loader /> : (
              players.length > 0 ? (
                players.map((competitor, index) => (
                  <UserRow competitor={competitor} index={index} key={index} />
                ))
              ) : (
                <p style={{ width: '100%', textAlign: 'center' }}>No Players Found</p>
              )
            )}
          </div>
          <img src='shades.png' alt='shades' className='shades' />
          <div className='coins'>
            <button onClick={showRank} style={!isAuthenticated ? hide : showw} className='rank'>Your Rank</button>
            <img src='coins.png' alt='coins' className='coinsimg' />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
