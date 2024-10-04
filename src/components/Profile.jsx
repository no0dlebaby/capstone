import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({setLoggedIn}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false)
        navigate('/login'); 
    };

    return (
        <div>
            <h1>User Profile</h1>
            <p>
                thank you for using Inu!
            </p>
            
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default Profile;
