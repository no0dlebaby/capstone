import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Products(addToCart) {
  const [products, setProducts] = useState([]);
  const handleAddToCart=()=>{
    addToCart(products.id)
  }
  useEffect(() => {
    fetch('http://localhost:2445/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="products-container">
      {products.length > 0 ? (
        products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image_url} alt={product.name} /> {}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <Link to={`/products/${product.id}`} className="details-link">View Details</Link>
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Products;
