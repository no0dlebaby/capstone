import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ setLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false)
        navigate('/login')
    };

    const handleViewOrders = async () => {
      const token = localStorage.getItem('token')
      console.log('Token:', token)
  
      if (!token) {
          console.error('No token found. User might not be logged in.');
          return;
      }
  
      try {
          const response = await fetch('http://localhost:2445/api/users/past-orders', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.ok) {
              const errorMessage = await response.text();
              console.error(`Error: ${response.status} ${response.statusText}`, errorMessage);
              throw new Error('Failed to fetch past orders');
          }
  
          const data = await response.json();
          console.log('Past Orders:', data);
      } catch (error) {
          console.error("Error fetching past orders:", error)
      }
  };
  

    return (
        <div>
            <h1>User Profile</h1>
            <p>Thank you for using Inu Pet Shop!</p>
            <br />
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default Profile;
