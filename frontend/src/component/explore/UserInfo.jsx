import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/userinfo.css'

const UserInfo = ({ user }) => {
  return (
    <div className="user-info-container">
      <div className="user-avatar">
        <Link to="/userdashboard">
          <img src={user ? user.avatar : '/avatar.svg'} alt={`${user ? user.user_name : ''}'s avatar`} />
        </Link>
      </div>
      <div className="user-details">
        <div className="user-name">{user ? user.full_name : ''}</div>
        <div className="user-level">Level {user ? user.level : ''}</div>
        <div className="user-progress">
          {/* can add progress bar logic here later */}
          <div className="level-progress-bar">
            <div className="current-progress" style={{ width: `${((user ? user.level : 0) % 1) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
