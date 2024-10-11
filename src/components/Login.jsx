import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username && password) {
            localStorage.setItem('token', 'your_token_here');
            setLoggedIn(true);
            navigate('/');
        }
    };

    const handleRegister = () => {
        navigate('/register')
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
            <h1>log in</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button onClick={handleRegister}>register</button>
                <button type="submit">log in</button>
            </form>
        </div>
    );
};

export default Login;
