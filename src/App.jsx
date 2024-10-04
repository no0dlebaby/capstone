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

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setLoggedIn(!!token)
    }
}, [])

const addToCart = (productId)=>{
  setCartItems((prevItems)=> [...prevItems, productId])
}


  return (
    <div>
      <NavBar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Products addToCart={addToCart}/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile setLoggedIn={setLoggedIn} />} />
      </Routes>
      </div>
  );
}

export default App;
