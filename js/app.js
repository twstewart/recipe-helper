import { fetcher } from "./utils";

const form = document.querySelector("#form");
const searchTextEl = document.querySelector("#search-text");
const searchResultsEl = document.querySelector("#search-results");
const mealsEl = document.querySelector("#meals");
const mealEl = document.querySelector("#meal");

form.addEventListener("submit", handleSearchRecipe);
mealsEl.addEventListener("click", getMealById);

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
  mealEl.innerHTML = null;
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

async function getMealById(e) {
  if (e.target.matches(".meal-info")) {
    const { mealId: id } = e.target.dataset;
    const { meals } = await fetchSingleRecipe(id);
    addMealToDOM(meals[0]);
  }
}

function addMealToDOM(meal) {
  const recipeInstructions = {};
  let i = 1;

  while (i <= 20 && meal[`strIngredient${i}`]) {
    recipeInstructions[meal[`strIngredient${i}`]] = meal[`strMeasure${i}`];
    i += 1;
  }

  mealEl.innerHTML = `
    <div class="meal-wrapper">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="meal-details">
        ${meal.strCategory ? `<h3>Category - ${meal.strCategory}</h3>` : null}
        ${meal.strArea ? `<h4>Cuisine - ${meal.strArea}</h4>` : null}
      </div>
      <div class="content">
        <h5>Instructions:</h5>
        <p>${meal.strInstructions}</p>
        <h6>Ingredients:</h6>
        <ul>
          ${Object.entries(recipeInstructions)
            .map(([ingredient, measurement]) => {
              return `
              <li>
                 ${ingredient} - ${measurement}
              </li>
            `;
            })
            .join("")}
        </ul>
      </div>
    </div>
  `;
}

function fetchRecipes(searchTerm) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  return fetcher(url);
}

function fetchSingleRecipe(recipeId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;
  return fetcher(url);
}
