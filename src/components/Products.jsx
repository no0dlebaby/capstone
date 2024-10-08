import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Products({ addToCart }) {
  const [products, setProducts] = useState([])
  const [addedToCart, setAddedToCart] = useState({})

  const handleAddToCart = (product) => {
    addToCart(product)

    setAddedToCart((prevState) => ({
      ...prevState,
      [product.id]: true,
    }))

    setTimeout(() => {
      setAddedToCart((prevState) => ({
        ...prevState,
        [product.id]: false,
      }))
    }, 2000)
  }

  useEffect(() => {
    fetch('http://localhost:2445/api/products')
      .then(response => response.json())
      .then(data => {console.log(data)
        setProducts(data)})
      .catch(error => console.error('error fetching products:', error))
  }, [])

  return (
    <div className="products-container">
      {products.length > 0 ? (
        products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.photo_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <Link to={`/products/${product.id}`} className="product-details">View Details</Link>
            <button 
              onClick={() => handleAddToCart(product)} 
              disabled={addedToCart[product.id]}
            >
              {addedToCart[product.id] ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        ))
      ) : (
        <p>no products available</p>
      )}
    </div>
  );
}

export default Products;
