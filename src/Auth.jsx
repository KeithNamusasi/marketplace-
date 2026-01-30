import React, { useState } from 'react';
import './Auth.css';

// 1. You MUST put { onLoginSuccess } here to receive the function from App.jsx
function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    county: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Prepare payload
    let endpoint, body;
    if (isLogin) {
      endpoint = '/api/auth/login';
      body = { email: formData.email, password: formData.password };
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      endpoint = '/api/auth/register';
      body = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      };
    }

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // 2. Success - Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 3. Notify App
      onLoginSuccess(data.user);
      alert(isLogin ? "Welcome back!" : "Account initialized successfully.");

    } catch (err) {
      console.error("Auth Error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-row">
                <div className="auth-input">
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="John" onChange={handleChange} required />
                </div>
                <div className="auth-input">
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Doe" onChange={handleChange} required />
                </div>
              </div>

              <div className="input-row">
                <div className="auth-input">
                  <label>Country</label>
                  <input type="text" name="country" placeholder="Kenya" onChange={handleChange} required />
                </div>
                <div className="auth-input">
                  <label>County</label>
                  <input type="text" name="county" placeholder="Nairobi" onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <div className="auth-input">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@future.com" onChange={handleChange} required />
          </div>

          <div className="auth-input">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="auth-input">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {isLogin ? "Access Terminal" : "Initialize Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;