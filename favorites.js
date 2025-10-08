// favorites.js

// Get favorites from localStorage
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

// Save favorites to localStorage
export function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Add a book to favorites
export function addToFavorites(book) {
  if (!book || !book.key) return;

  const favorites = getFavorites();
  if (!favorites.some(f => f.key === book.key)) {
    favorites.push({
      key: book.key,
      title: book.title || "Untitled",
      author: book.author || "Unknown Author",
      imgSrc: book.imgSrc || "https://via.placeholder.com/150x200?text=No+Cover"
    });
    saveFavorites(favorites);
    alert("✅ Added to Favorites!");
    renderFavorites(); // Safely update the favorites list if container exists
  } else {
    alert("❤ Already in Favorites!");
  }
}

// Remove a book from favorites
export function removeFromFavorites(key) {
  if (!key) return;

  const favorites = getFavorites().filter(b => b.key !== key);
  saveFavorites(favorites);
  renderFavorites(); // Update the favorites list
}

// Render favorites on the page
export function renderFavorites() {
  const container = document.getElementById("favoritesContainer");
  if (!container) return;

  const favorites = getFavorites();
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No favorites yet. Start exploring books!</p>`;
    return;
  }

  favorites.forEach(book => {
    const card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col";

    card.innerHTML = `
      <img src="${book.imgSrc}" alt="${book.title}" class="w-full h-64 object-cover">
      <div class="p-3 flex flex-col flex-1">
        <h4 class="font-semibold text-sm mb-1 line-clamp-2">${book.title}</h4>
        <p class="text-gray-600 dark:text-gray-400 text-xs mb-2">${book.author}</p>
        <button class="remove-fav bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 mt-auto">
          🗑 Remove
        </button>
      </div>
    `;

    card.querySelector(".remove-fav").addEventListener("click", () => removeFromFavorites(book.key));
    container.appendChild(card);
  });
}
