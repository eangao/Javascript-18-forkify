import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  //   So the controller, it doesn't need to interfere
  // in any of this and so therefore we can simply run
  // this function here as soon as this object is created.
  // And so what I'm gonna do is
  // to this time add a constructor method,
  // then since this is a child class,
  // we need to start by calling super.
  // And so only after that, we can use the this keywords.
  // And then let's say, this.addHandlerShowWindow.
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      //FormData  pass an element which is  a form - this here is pointing the parent element (this._parentElement) which is the form
      const dataArr = [...new FormData(this)]; // array of all the fields

      // convert array to object; fromEntries is the opposite of entries on array
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
