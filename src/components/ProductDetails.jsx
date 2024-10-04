import { useParams } from 'react-router-dom';
import '../App.css';
import React, { useState, useEffect } from 'react';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:2445/api/products/${id}`) // Fetch the specific product using the ID
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details">
      <img src={product.image_url} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
