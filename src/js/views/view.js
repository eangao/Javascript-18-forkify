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

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Remove this after implementing - this can cause error if you reload the page
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;

    const newMarkup = this._generateMarkup();

    //     So here we now have the Markup
    // but that is just a string.
    // And so that is gonna be very difficult to compare
    // to the DOM elements that we currently have
    // on the page.
    // And so to fix that problem,
    // we can actually use a nice trick,
    // which is to basically convert this Markup string
    // to a DOM object
    // that's living in the memory
    // and that we can then use
    // to compare with the actual DOM that's on the page.
    //     So this will create something called a range,
    // and on the range, we can then call yet another method,
    // which is called createContextualFragment.
    // And so this is where we then pass in the string
    // of Markup, so like a string of HTML.
    // And so as I said before,
    // this method will then convert that string
    // into real DOM Node objects.
    // So basically, newDOM here
    // will become like a big object,
    // which is like a virtual DOM.
    // So a DOM that is not really living on the page
    // but which lives in our memory.
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
      // UPdates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥💥💥', newEl.firstChild?.nodeValue.trim() !== '');
        curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }

      //       Now, this algorithm here
      // is probably not the most robust one
      // and so maybe it might not be the best algorithm
      // to really use in the real world
      // unless you have like a kind
      // of small application, like this one.
      // But for a really huge application,
      // probably this algorithm is not performant enough
      // and might not be good enough.
    });
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
