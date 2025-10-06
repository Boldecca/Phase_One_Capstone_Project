// ============================================
// MODULE: API Manager (Open Library)
// ============================================

import { addToFavorites } from "./favorites.js";

export async function fetchTrendingBooks() {
  try {
    const res = await fetch('https://openlibrary.org/search.json?q=bestseller&limit=18');
    const data = await res.json();
    return data.docs;
  } catch (err) {
    console.error("Error fetching trending books:", err);
    return [];
  }
}

export async function searchBooks(query) {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=18`);
    const data = await res.json();
    return data.docs;
  } catch (err) {
    console.error("Error searching books:", err);
    return [];
  }
}

export function displayBooks(books) {
  const container = document.getElementById("booksContainer");
  if (!container) return;
  container.innerHTML = "";

  if (!books.length) {
    container.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 col-span-full">No books found.</p>`;
    return;
  }

  books.forEach(book => container.appendChild(createBookCard(book)));
}

function createBookCard(book) {
  const coverId = book.cover_i;
  const imgSrc = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/150x220?text=No+Cover";

  const title = book.title || "Untitled";
  const author = book.author_name ? book.author_name[0] : "Unknown Author";
  const key = book.key || book.cover_edition_key || book.edition_key?.[0] || Math.random().toString();

  const card = document.createElement("div");
  card.className = "bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition";
  card.innerHTML = `
    <img src="${imgSrc}" alt="${title}" class="w-full h-64 object-cover">
    <div class="p-3">
      <h4 class="font-semibold text-sm mb-1 line-clamp-2">${title}</h4>
      <p class="text-gray-600 dark:text-gray-400 text-xs mb-2">${author}</p>
      <button class="add-fav bg-black dark:bg-white text-white dark:text-black text-xs px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-200 w-full">❤ Add to Favorites</button>
    </div>
  `;

  card.querySelector(".add-fav").addEventListener("click", () => {
    addToFavorites({ key, title, author, imgSrc });
  });

  return card;
}
