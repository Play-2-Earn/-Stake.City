import React from 'react';
import '../styles/userinfo.css'

const UserInfo = ({ user }) => {
  return (
    <div className="user-info-container">
      <div className="user-avatar">
        <img src={user.avatar} alt={`${user.name}'s avatar`} />
      </div>
      <div className="user-details">
        <div className="user-name">{user.name}</div>
        <div className="user-level">Level {user.level}</div>
        <div className="user-progress">
          {/* can add progress bar logic here later */}
          <div className="level-progress-bar">
            <div className="current-progress" style={{ width: `${(user.level % 1) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;