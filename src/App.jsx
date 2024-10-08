import './App.css'
import Products from './components/Products'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import ProductDetails from './components/ProductDetails'
import Categories from './components/Categories'
import Login from './components/Login'
import Cart from './components/Cart'
import NavBar from './components/NavBar';
import Profile from './components/Profile'
import Register from './components/Register';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState(() => {

    const storedCartItems = localStorage.getItem('cartItems');
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find(item => item.id === product.id);

      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div>
      <NavBar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Products addToCart={addToCart}/>} />
        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart}/>} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems}/>} />
        <Route path="/profile" element={<Profile setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
