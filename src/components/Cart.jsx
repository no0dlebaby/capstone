import React from 'react';
import '../App.css';

const Cart = ({ cartItems, setCartItems }) => {

  const handleRemove = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    alert('thank you for your purchase!');
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img style={{ width: '200px', height: 'auto' }} src={item.photo_url} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p className="price">${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className="cart-item-controls">
            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <button onClick={() => increaseQuantity(item.id)}>+</button>
            <button onClick={() => handleRemove(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
      <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;
