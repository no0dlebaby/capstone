import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token
        }
      };
      try {
        const response = await axios.get('http://localhost:8080/api/users/cart', config);
        setCartItems(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item.product_id}>
            {item.name} - ${item.price} (Quantity: {item.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
