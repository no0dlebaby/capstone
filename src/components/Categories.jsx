import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:2445/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Error fetching categories: {error}</p>;
  }

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
        <p>No categories available</p>
      )}
    </div>
  );
}

export default Categories;
