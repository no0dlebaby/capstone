import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const Login = ({setLoggedIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password)
      if (response.token) {
          localStorage.setItem('token', response.token)
          setLoggedIn(true)
          navigate('/profile')
      }
    } catch (error) {
      console.error(error);
    }
  };
  const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:2445/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
  
      return data; 
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
