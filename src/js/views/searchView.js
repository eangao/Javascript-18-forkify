class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;

    this._clearInput();

    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //Publisher
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      // this handler function should be the control searchResults function.
      handler();
    });
  }
}

export default new SearchView();
