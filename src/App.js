import React, { useEffect, useState } from 'react';
import './App.css';
import Recipe from './Recipe';

const App = () => {
  const APP_ID = 'YOUR_APP_ID'; // Replace with your actual Edamam API ID
  const APP_KEY = 'YOUR_APP_KEY'; // Replace with your actual Edamam API Key

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("chicken"); // Clearer variable name
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Store any errors

  useEffect(() => {
    const getRecipes = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Clear any previous errors

      try {
        const response = await fetch(
          `https://api.edamam.com/search?q=${searchTerm}&app_id=${APP_ID}&app_key=${APP_KEY}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRecipes(data.hits || []); // Ensure recipes is an array
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setIsLoading(false); // Set loading state to false after request completes
      }
    };

    getRecipes();
  }, [searchTerm]); // Dependency array includes searchTerm

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    getRecipes(); // Call getRecipes on search submit
  };

  return (
    <div className="App">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          className="search-bar"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Recipes" // Add placeholder for user guidance
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      {isLoading && <p>Loading recipes...</p>} // Display loading message
      {error && <p className="error-message">Error: {error}</p>} // Display error message
      <div className="recipes">
        {recipes.map((recipe) => (
          <Recipe
            key={recipe.recipe.uri}
            title={recipe.recipe.label}
            calories={recipe.recipe.calories}
            image={recipe.recipe.image}
            ingredients={recipe.recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

