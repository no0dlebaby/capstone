import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import FoodProducts from './FoodProducts';

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:2445/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('rror fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      <h1>Categories</h1>
      <br />
      {categories.length > 0 ? (
        categories.map((category) => (
          <Link key={category.id} to={`/categories/${category.id}`}>
            <button className="category-button">
              {category.name}
            </button>
          </Link>
        ))
      ) : (
        <p>no categories available</p>
      )}
    </div>
  );
}

export default Categories;
