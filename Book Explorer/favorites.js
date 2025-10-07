// ============================================
// MODULE: Favorites Manager
// ============================================

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function addToFavorites(book) {
  const favorites = getFavorites();
  if (!favorites.some(f => f.key === book.key)) {
    favorites.push(book);
    saveFavorites(favorites);
    alert("✅ Added to Favorites!");
    renderFavorites();
  } else {
    alert("❤ Already in Favorites!");
  }
}

export function removeFromFavorites(key) {
  const favorites = getFavorites().filter(b => b.key !== key);
  saveFavorites(favorites);
  renderFavorites();
}

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
    card.className = "bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition";
    card.innerHTML = `
      <img src="${book.imgSrc}" alt="${book.title}" class="w-full h-64 object-cover">
      <div class="p-3">
        <h4 class="font-semibold text-sm mb-1 line-clamp-2">${book.title}</h4>
        <p class="text-gray-600 dark:text-gray-400 text-xs mb-2">${book.author}</p>
        <button class="remove-fav bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 w-full">
          🗑 Remove
        </button>
      </div>
    `;
    card.querySelector(".remove-fav").addEventListener("click", () => removeFromFavorites(book.key));
    container.appendChild(card);
  });
}