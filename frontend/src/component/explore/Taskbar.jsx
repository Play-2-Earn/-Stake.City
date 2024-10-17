import SearchBar from './searchbar';
import React from 'react';
import '../styles/taskbar.css';
const Taskbar = () => {
  return (
    <div className="taskbar">
      <div className="task-item">
        <img src="/messages-icon.png" alt="Task 1" className="task-icon" />
      </div>
      <div className="task-item">
        <img src="/tasks-icon.png" alt="Task 2" className="task-icon" />
      </div>
      <div className="task-item">
        <img src="/settings-icon.png" alt="Task 3" className="task-icon" />
      </div>
      {/* Add more task items as needed */}
    </div>
  );
};

export default Taskbar;
