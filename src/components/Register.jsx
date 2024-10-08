import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return;
    }
    
    const user = { username, email, password }
    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful! You can now log in.');
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="email"
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Confirm Password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
