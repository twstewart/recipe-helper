import { fetcher } from "./utils";

const form = document.querySelector("#form");
const searchTextEl = document.querySelector("#search-text");
const searchResultsEl = document.querySelector("#search-results");
const mealsEl = document.querySelector("#meals");

form.addEventListener("submit", handleSearchRecipe);

async function handleSearchRecipe(e) {
  e.preventDefault();

  const searchTerm = form["recipe"].value;

  try {
    const data = await fetchRecipes(searchTerm);

    if (!data.meals) throw new Error("Recipe does not exist!");

    updateSearchResultsUI(searchTerm);
    updateMealsUI(data.meals);
  } catch (error) {
    alert(error.message);
  }

  form.reset();
}

function updateSearchResultsUI(searchTerm) {
  searchTextEl.classList.remove("hidden");
  searchResultsEl.textContent = searchTerm;
}

function updateMealsUI(meals) {
  const html = meals
    .map((meal) => {
      return `
        <div class="meal-card" title="See recipe">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="meal-info" data-meal-id="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      `;
    })
    .join("");

  mealsEl.insertAdjacentHTML("afterbegin", html);
}

function fetchRecipes(searchTerm) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  return fetcher(url);
}
