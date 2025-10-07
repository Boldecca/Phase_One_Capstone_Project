// ============================================
// MAIN APP
// ============================================

import { fetchTrendingBooks, searchBooks, fetchBooksByCategory, displayBooks } from "./fetchbooks.js";

// ===== Dark Mode =====
export function initDarkMode() {
  const btn = document.getElementById("darkModeBtn");
  if (!btn) return;

  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) document.documentElement.classList.add("dark");
  btn.textContent = isDark ? "☀️" : "🌙";

  btn.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    btn.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("darkMode", dark);
  });
}

// ===== Mobile Menu =====
export function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => menu.classList.toggle("hidden"));
}

// ===== Search =====
export function initSearch() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("searchInput");
  if (!btn || !input) return;

  btn.addEventListener("click", () => searchAndDisplayBooks(input.value));
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") searchAndDisplayBooks(input.value);
  });
}

// ===== Load & Display Functions =====
export async function searchAndDisplayBooks(query) {
  const loading = document.getElementById("loadingState");
  const container = document.getElementById("booksContainer");
  const titleEl = document.getElementById("booksTitle");
  if (!loading || !container || !titleEl) return;

  if (!query.trim()) return loadTrendingBooks();

  loading.classList.remove("hidden");
  container.innerHTML = "";
  titleEl.textContent = `Search Results for "${query}"`;

  try {
    const books = await searchBooks(query);
    displayBooks(books);
  } catch (err) {
    container.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to search books.</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}

export async function loadTrendingBooks() {
  const loading = document.getElementById("loadingState");
  const container = document.getElementById("booksContainer");
  const titleEl = document.getElementById("booksTitle");
  if (!loading || !container || !titleEl) return;

  loading.classList.remove("hidden");
  container.innerHTML = "";
  titleEl.textContent = "Trending Books";

  try {
    const books = await fetchTrendingBooks();
    displayBooks(books);
  } catch (err) {
    container.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load books.</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}

// ===== Categories =====
export function initCategories() {
  const categoryButtons = document.querySelectorAll("[data-category]");
  const titleEl = document.getElementById("booksTitle");
  const loading = document.getElementById("loadingState");
  const container = document.getElementById("booksContainer");

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const category = btn.dataset.category;
      if (!category || !loading || !container || !titleEl) return;

      loading.classList.remove("hidden");
      container.innerHTML = "";
      titleEl.textContent = `Category: ${category}`;

      try {
        const books = await fetchBooksByCategory(category);
        displayBooks(books);
      } catch (err) {
        container.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load category books.</p>`;
      } finally {
        loading.classList.add("hidden");
      }
    });
  });
}

// ===== Auto-init =====
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initMobileMenu();
  initSearch();
  initCategories(); // category buttons
  loadTrendingBooks();
});
