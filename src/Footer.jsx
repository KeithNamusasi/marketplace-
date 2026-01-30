import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>MARKETPLACE</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>SUPPORT</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Center</a></li>
                        <li><a href="#">Community Guidelines</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>LEGAL</h4>
                    <ul>
                        <li><a href="#">Cookies Policy</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Law Enforcement</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>INSTALL APP</h4>
                    <ul>
                        <li><a href="#">Google Play</a></li>
                        <li><a href="#">App Store</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Future Marketplace. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
