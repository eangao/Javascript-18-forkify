import icons from 'url:../../img/icons.svg'; // Parcel 2

// exporting the class itself
// we are not going to create any instance of this view.
// We will only use it as a parent class
// of these other child views

export default class View {
  //   And that is that right now,
  // with Parcel and Babel,
  // inheritance between these truly private fields
  // and methods doesn't really work yet.
  // So here it was nice to actually use the native way
  // of JavaScript of protected methods and properties
  // but now we cannot really use it anymore.
  // So maybe that might be possible at some point in the future
  // but for now, we will have to go back to protected fields
  // and protected methods.
  //   So changing from truly private
  // to only protected using the underscore convention.

  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = ` 
    <div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
