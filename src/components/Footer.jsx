import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Customer Support</h3>
                    <ul>
                        <li>Help Center</li>
                        <li>Returns</li>
                        <li>FAQs</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>About Us</h3>
                    <ul>
                        <li>Careers</li>
                        <li>Our Story</li>
                        <li>Blog</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Order Info</h3>
                    <ul>
                        <li>Track Order</li>
                        <li>Order History</li>
                        <li>Shipping Information</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Cozy Pet Shop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
