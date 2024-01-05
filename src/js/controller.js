import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable'; // polyfilling everything else.
import 'regenerator-runtime'; // polyfilling async/await

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////
// Event Handlers in MVC: Publisher-Subscriber Pattern
///////////////////////////////////////////////////////////
// SEE PDF LECTURE AND VIDEO

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
