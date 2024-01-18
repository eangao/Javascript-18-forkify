import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable'; // polyfilling everything else.
import 'regenerator-runtime'; // polyfilling async/await

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// and so let's activate that hot module reloading
//coming from parcel
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get serach queary
    const query = searchView.getQuery();

    if (!query) return;

    // 2) Load search
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

///////////////////////////////////////////////////////////
// Event Handlers in MVC: Publisher-Subscriber Pattern
///////////////////////////////////////////////////////////
// SEE PDF LECTURE AND VIDEO
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
