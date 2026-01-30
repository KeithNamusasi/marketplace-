import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ onLoginClick, isLoggedIn, cartCount, onCartClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSellClick = () => {
    if (!isLoggedIn) {
      onLoginClick();
    } else {
      navigate('/sell');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="futuristic-header">
      <div className="glass-nav">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <div className="logo-glow"></div>
          <h1 className="logo-text">GEN<span>MAX</span></h1>
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {/* Mobile Search */}
          <div className="mobile-only mobile-search" style={{ display: isMenuOpen ? 'flex' : 'none' }}>
            <input type="text" placeholder="Search products..." />
          </div>

          <Link to="/" className="nav-btn" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <button className="nav-btn" onClick={handleSellClick}>Sell Item</button>

          {/* Cart in Mobile Menu */}
          <button className="nav-btn mobile-only" onClick={() => { onCartClick(); setIsMenuOpen(false); }}>
            Cart ({cartCount})
          </button>

          {isLoggedIn ? (
            <div className="auth-group">
              <Link to="/profile" className="nav-btn" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button className="nav-btn logout" onClick={() => { onLogout(); setIsMenuOpen(false); }}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn login-btn" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>
              Login / Register
            </button>
          )}
        </nav>

        <div className="header-icons">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="cart-container" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;