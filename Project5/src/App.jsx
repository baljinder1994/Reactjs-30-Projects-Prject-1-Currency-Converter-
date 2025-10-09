import React, { useState, useEffect } from "react";

const App = () => {
  const [query, setQuery] = useState("pasta");
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(res => res.json())
      .then(data => setRecipes(data.meals || []));
  }, [query]);

  const toggleFavorite = (meal) => {
    const exists = favorites.find(f => f.idMeal === meal.idMeal);
    let updated;
    if (exists) {
      updated = favorites.filter(f => f.idMeal !== meal.idMeal);
    } else {
      updated = [...favorites, meal];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-red-600 drop-shadow-lg">
        🍽️ Food Recipe Explorer
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes (e.g. pasta, chicken)..."
          className="w-full max-w-md p-3 border rounded-2xl shadow-lg focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* Recipe Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {recipes.map((meal) => (
          <div
            key={meal.idMeal}
            className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{meal.strMeal}</h2>
              <button
                onClick={() => setSelected(meal)}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                View Recipe
              </button>
              <button
                onClick={() => toggleFavorite(meal)}
                className="ml-3 text-2xl"
              >
                {favorites.find(f => f.idMeal === meal.idMeal) ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl max-w-lg w-full relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3">{selected.strMeal}</h2>
            <img
              src={selected.strMealThumb}
              alt={selected.strMeal}
              className="rounded-xl mb-3"
            />
            <p className="mb-3 text-gray-600">{selected.strInstructions}</p>
            {selected.strYoutube && (
              <a
                href={selected.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                ▶ Watch on YouTube
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
