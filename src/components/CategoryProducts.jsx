import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

function CategoryProducts({ addToCart }) {

  const { categoryId } = useParams()
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const handleAddToCart = (product) => {
    addToCart(product);

    setAddedToCart((prevState) => ({
      ...prevState,
      [product.id]: true,
    }));

    setTimeout(() => {
      setAddedToCart((prevState) => ({
        ...prevState,
        [product.id]: false,
      }));
    }, 2000);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {

        const response = await fetch(`http://localhost:2445/api/products?category=${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching category products:', error);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

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
        <p>No products available in this category.</p>
      )}
    </div>
  );
}

export default CategoryProducts;
