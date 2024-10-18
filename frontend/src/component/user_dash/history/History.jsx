import React, { useState } from 'react';
import './History.css'; // Make sure your CSS file is correctly referenced

// Example Data (This can later be replaced with real data or fetched via API)
const answeredQuestions = [
  { task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", timeframe: "40min", date: "11/12/2024", level: 2, tokensEarned: 234 },
  { task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", timeframe: "30min", date: "01/12/2024", level: 1, tokensEarned: 134 },
  { task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", timeframe: "38min", date: "11/11/2024", level: 3, tokensEarned: 200 },
];

const releasedTasks = [
  { task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", wonBy: "Jett", timeframe: "40min", date: "11/12/2024", stakingReward: 234 },
  { task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", wonBy: "Den", timeframe: "30min", date: "01/12/2024", stakingReward: 134 },
];

const History = ({isOpen, onClose}) => {
  const [isTokenPopupOpen, setTokenPopupOpen] = useState(false);
  const [tokenPopupData, setTokenPopupData] = useState(null);
  const [showAnswered, setShowAnswered] = useState(true); // State to toggle between answered and released tasks

  // Function to handle token popup opening
  const openTokenPopup = (task, tokensEarned) => {
    setTokenPopupData({ task, tokensEarned });
    setTokenPopupOpen(true);
  };

  
  if(!isOpen) return(null)
  return (
    <div className="history-popup"> {/* Full-page overlay */}
      <div className="popup-content"> {/* Main content */}
        <h2 className="header-title">Player History</h2>
        <button className="back-button" onClick={onClose}>
          ← <span className="back-icon"></span> {/* Placeholder for icon */}
        </button>

        <div className="history-container">
          {/* Buttons to toggle between answered tasks and released tasks */}
          <div className="toggle-buttons">
            <button
              onClick={() => setShowAnswered(true)}
              className={showAnswered ? 'active' : ''}
            >
              Answered Tasks
            </button>
            <button
              onClick={() => setShowAnswered(false)}
              className={!showAnswered ? 'active' : ''}
            >
              Released Tasks
            </button>
          </div>

          {/* Conditionally render the sections based on the selected button */}
          {showAnswered ? (
            <div className="answered-tasks">
              <h3>Answered Tasks</h3>
              <table className="answered-tasks-table">
                <thead>
                  <tr>
                    <th>Correctly Answered Task</th>
                    <th>Date</th>
                    <th>Level</th>
                    <th>Token Staking Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {answeredQuestions.map((item, index) => (
                    <tr key={index} onClick={() => openTokenPopup(item.task, item.tokensEarned)}>
                      <td>{item.task}</td>
                      <td>{item.date}</td>
                      <td>{item.level}</td>
                      <td>{item.tokensEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="released-tasks">
              <h3>Released Tasks</h3>
              <table className="released-tasks-table">
                <thead>
                  <tr>
                    <th>Asked Tasks</th>
                    <th>Won By</th>
                    <th>TimeFrame</th>
                    <th>Date</th>
                    <th>Staking Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {releasedTasks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.task}</td>
                      <td>{item.wonBy}</td>
                      <td>{item.timeframe}</td>
                      <td>{item.date}</td>
                      <td>{item.stakingReward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Token Details Popup can be included here if necessary */}
          {/* {isTokenPopupOpen && tokenPopupData && (
            <TokenDetailsPopup
              task={tokenPopupData.task}
              tokensEarned={tokenPopupData.tokensEarned}
              onClose={() => setTokenPopupOpen(false)}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default History;
