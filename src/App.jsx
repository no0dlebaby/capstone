import { useState } from 'react'
import './App.css'
import Products from './components/Products'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import ProductDetails from './components/ProductDetails';
import Categories from './components/Categories';
import Login from './components/Login';
import Cart from './components/Cart';
import NavBar from './components/NavBar';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <Routes>
            <Route path="/" element={<Products />} />
        </Routes>
    </div>
  )
}

export default App
