import React, { useEffect, useState } from 'react';

const PastOrders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('no token found. user might not be logged in.')
        return
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
          const errorMessage = await response.text()
          console.error(`Error: ${response.status} ${response.statusText}`, errorMessage)
          throw new Error('Failed to fetch past orders')
        }

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching past orders:', error)
      }
    };

    fetchOrders()
  }, []);

  return (
    <div>
      <h2>Past Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>Order ID: {order.id}, Total: {order.total}</li>
        ))}
      </ul>
    </div>
  );
};

export default PastOrders;
