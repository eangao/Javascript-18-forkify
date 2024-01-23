import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,

    //     So remember that the end operator short-circuits.
    // So if recipe.key is a faulty value,
    // so if it doesn't exist
    // well, then nothing happens here, right.
    // And so then destructuring here, well does basically nothing.
    // Now, if this actually is some value,
    // then the second part of the operator
    // is executed and returned.
    // And so in that case, it is this object
    // here basically that is going to be returned.
    // And so then this whole expression will become that object.
    // And so then we can spread that object
    // to basically put the values here.
    // And so that will then be the same
    // as if the values would be out here like this,
    // key recipe.key.
    // But again, only in case that the key actually does exist.
    // And so this is a very nice trick
    // to conditionally add properties to an object.
    // So keep this one in mind,
    // now it is a very handy trick sometimes.
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    state.recipe = createRecipeObject(data);

    //     So it will be loaded from the API, right?
    // We are not loading this recipe from the bookmarks.
    // And actually we won't do that.
    // But what we will do is to now use the data that we store
    // in the bookmarks array and the state
    // to basically Mark any recipe that we load as bookmarked,
    // if it is already in the bookmarks array.
    // So that probably sounded more complicated
    // than it actually is.
    // Okay so let's go here back to the model
    // and then to our function, which loads the recipe.
    // So that is this one.
    // So here the as we got all this data
    // and store it in the state.
    // Then what we can do is to check if there is already a recipe
    // with the same ID in the bookmarks state.
    // And if it is then we will mark the current recipe
    // that we just loaded from the API as bookmarked set to true.
    // So let's use
    // one of the nice array methods that we learned about,
    // which is the sum method.
    // And remember that the sum method returns true or false.
    // And so that's great for doing an if check like this.
    // So here we can check if state.bookmarks.some
    // which basically means any,
    // so at least that's how I like to think about this method.
    // So this method will loop over an array
    // and then return true if any of them actually has to
    // for the condition that we specify here.
    // So if bookmark.id is the same
    // as the ID that we just received here
    // okay, let's call this here bookmark actually.
    // And so basically what this means is that
    // if there is any bookmark, which has the bookmark ID
    // equal to the ID that we just received
    // well, then we want the current recipe
    // which is state.recipe to be bookmarked.
    // So bookmark equal to true.
    // Okay and otherwise we wanted a set to false.
    // And so with this, all the recipes that we now load
    // we'll always have bookmarked set to either true or false.
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);

    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQty = oldQty * newServings / oldServings  //  2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmarked
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// for debugging
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // Centries onvert object to array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    console.log(data);
  } catch (err) {
    throw err;
  }
};
