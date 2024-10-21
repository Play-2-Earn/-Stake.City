import React from 'react';
import '../styles/taskbar.css'; // External CSS for styles

const Taskbar = () => {
  return (
    <div className="taskbar-container">
      <div className="taskbar">
        <button className="taskbar-btn">
          <img src="/tasks-icon.png" alt="Tasks" className="taskbar-icon tasks" />
        </button>
        <button className="taskbar-btn">
          <img src="/messages-icon.png" alt="Chat" className="taskbar-icon messages" />
        </button>
        <button className="avatar-btn">
          <img src="/avatar.svg" alt="Avatar" className="avatar-icon" />
        </button>
        <button className="taskbar-btn">
          <img src="/release-stake-icon.png" alt="Release-Stake" className="taskbar-icon release-stake" />
        </button>
        <button className="taskbar-btn">
          <img src="/settings-icon.png" alt="Settings" className="taskbar-icon settings" />
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
