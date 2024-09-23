// components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/logo7.png';
import styles from './Header.module.css'; // Import the CSS Module

const Header = ({ isLandingPage, isMobile }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isLandingPage) {
    return null;  // Only render header on the landing page
  }

  return (
    <div className={styles.header}>  {/* Apply CSS Module styles */}
      <img src={logo} alt="Logo" style={{ width: '80px', height: '80px' }} />
      {isMobile ? (
        <div>
          <button onClick={() => setMenuOpen(!menuOpen)} className={styles.mobileMenuButton}>
            <Menu size={24} />
          </button>
          {menuOpen && (
            <div className={styles.mobileMenu}>
              <Link to="/roadmap" className={styles.mobileLink}>Roadmap</Link>
              <Link to="/lite-paper" className={styles.mobileLink}>Lite Paper</Link>
              <Link to="/white-paper" className={styles.mobileLink}>White Paper</Link>
              <Link to="/Documentation" className={styles.mobileLink}>Documentation</Link>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/roadmap"><button className={styles.button}>Roadmap</button></Link>
          <Link to="/lite-paper"><button className={styles.button}>Lite Paper</button></Link>
          <Link to="/white-paper"><button className={styles.button}>White Paper</button></Link>
          <Link to="/Documentation"><button className={styles.button}>Documentation</button></Link>
        </div>
      )}
    </div>
  );
};

export default Header;
