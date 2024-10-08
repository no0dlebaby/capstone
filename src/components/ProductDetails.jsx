import { useParams } from 'react-router-dom';
import '../App.css';
import React, { useState, useEffect } from 'react';

const ProductDetails = ({addToCart}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null)
  const [addedToCart, setAddedToCart]= useState(false)

  useEffect(() => {
    fetch(`http://localhost:2445/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('error fetching product details:', error))
  }, [id])

  const handleAddToCart=()=>{
    if (product){
    addToCart(product)
    setAddedToCart(true)

    setTimeout(()=>{
      setAddedToCart(false)
    }, 2000)
  }
  }

  if (!product) {
    return <p>loading product details...</p>;
  }

  return (
    <div className="product-details">
      <img src={product.image_url} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button onClick={handleAddToCart} disabled={addedToCart}>{addedToCart ? 'added!' : 'add to cart'}</button>
    </div>
  );
};

export default ProductDetails;
