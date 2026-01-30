import React from 'react';
import './LandingPage.css';

function LandingPage({ onLoginClick }) {
    return (
        <div className="landing-container">

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">BETA ACCESS LIVE</div>
                <h1 className="hero-title">
                    Trade in the <br />
                    <span>Digital Future</span>
                </h1>
                <p className="hero-subtitle">
                    The world's first decentralized marketplace for next-generation hardware
                    and digital assets. Secure, anonymous, and instant.
                </p>

                <div className="cta-group">
                    <button className="cta-primary" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                        Start Shopping
                    </button>
                    {!onLoginClick && (
                        <button className="cta-secondary">
                            Learn More
                        </button>
                    )}
                    {onLoginClick && (
                        <button className="cta-secondary" onClick={onLoginClick}>
                            Sign In
                        </button>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon">🛡️</span>
                    <h3>Secure & Encrypted</h3>
                    <p>End-to-end encryption ensures your transactions and identity remain completely private.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">⚡</span>
                    <h3>Instant Settlement</h3>
                    <p>No waiting days for payouts. Our smart contract system settles deals in milliseconds.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🌍</span>
                    <h3>Global Access</h3>
                    <p>Trade with anyone, anywhere in the world without border restrictions or currency fees.</p>
                </div>
            </section >

            {/* Stats Bar */}
            < div className="stats-bar" >
                <div className="stat-item">
                    <span className="stat-number">$2M+</span>
                    <span className="stat-label">Volume Traded</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">50k+</span>
                    <span className="stat-label">Verified Items</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">120</span>
                    <span className="stat-label">Countries Support</span>
                </div>
            </div >

        </div >
    );
}

export default LandingPage;
