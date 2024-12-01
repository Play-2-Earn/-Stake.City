import React, { useEffect, useState } from 'react'
import '../styles/UserRow.css'
import axios from 'axios';

const UserRow = ({competitor , index}) => {
  const [currentId , setCurrentId] = useState(sessionStorage.getItem('user') ? sessionStorage.getItem('user') : null);


  return (
    <div className={competitor.user_name === currentId ? "currentuser" : "userrow"}>
        <div className='rank'>
            <img src={index <= 3 ? `crown${index + 1}.png` : `crown4.png`} alt='rank' className='rankimg'/>
            <p>{index + 1}</p>
        </div>
        <div className='user'>
            <img src='img1.png' alt='user' className='userimg'/>
            <div className='userinfo'>
                <p className='name'>{competitor.user_name}</p>
                <p className='location'>{competitor.location ? competitor.location : 'No location provided'}</p>
                <div className='helpUser'>
                  <p>
                  {competitor.user_name}
                  </p>
                </div>
            </div>
        </div>
        <div className='achievement'>
            <div className='reputation'>
            <p className='key'>Reputation:</p>
            <p className='val'> {competitor ? competitor.reputation_badge  : '  ...'} </p>
            </div>
          <img src='badge.png' alt='badge' className='badgeimg'/>
        </div>
        <div className='trophy'>
          <img src='trophy.png' alt='trophy' className='trophyimg'/>
        </div>
        <div className='credits'>
          <p className='val'> ${competitor ? competitor.stake_amount : '  ...'}</p>
          <p className='key'> Stake Amount </p>
          <div className='helpCredits'>
            <p>
              ${competitor.stake_amount}
            </p>
          </div>
        </div>
    </div>
  )
}

export default UserRow
