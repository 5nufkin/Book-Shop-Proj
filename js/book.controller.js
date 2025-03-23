'use strict'

const gQueryOptions = {
  filterBy: { txt: '', minRating: 0 },
  sortBy: {}
}

function onInit() {
  readQueryParams()
  renderQueryParams()
  renderBooks()
}

function renderBooks() {
  const books = getBooks(gQueryOptions)
  if (!books || !books.length) {
    _renderNoBooksFound()
    return
  }
  var strHTMLs = books.map(book => `<tr>
        <td>${book.title}</td>
        <td>${book.rating === 0 ? 'Unrated' : book.rating}</td>
        <td>$${Number(book.price).toFixed(2)}</td>
        <td>
          <button class="btn btn-read" onclick="onSeeDetails('${book.id}')">Read</button>
          <button class="btn btn-update" onclick="onUpdateBook('${book.id}')">Update</button>
          <button class="btn btn-delete" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>`)

  document.querySelector('.book-table tbody').innerHTML = strHTMLs.join('')

  renderStats()
}

function _renderNoBooksFound() {
  const strHTML = `<td colspan="4"><h1 class="no-books-found">No matching books were found...</h1></td>`
  document.querySelector('.book-table tbody').innerHTML = strHTML
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  _showSucessModal('deleted')
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = prompt('Enter new book price:')
  updatePrice(bookId, newPrice)
  _showSucessModal('updated')
  renderBooks()
}

function onAddBook() {
  const bookName = prompt('Enter book name:')
  const bookPrice = +prompt('Enter book price:')
  const bookRating = +prompt('Enter rating 1-5:')
  if (bookName.length && bookPrice > 0 && ((bookRating >= 1 && bookRating <= 5) || !bookRating)) {
    addBook(bookName, bookPrice, bookRating)
    _showSucessModal('added')
    renderBooks()
  } else {
    _showErrorModal()
  }
}

function onSeeDetails(bookId) {
  const bookDetails = getBook(bookId)
  const modal = document.querySelector('.modal ')
  modal.innerHTML = ` <button class="modal-close" onclick="onCloseModal()">x</button>
                      <div class="grid-container">
                      <div class="img-container"><img class="modal-img" src="${bookDetails.imgUrl}"></div>
                      <h1 class="modal-title">${bookDetails.title}</h1>
                      <h2 class="modal-price">Price: <span class="font-weight-normal">$${Number(bookDetails.price).toFixed(2)}</span></h2>
                      <h2 class="modal-rating">Rating: <span class="font-weight-normal">${bookDetails.rating === 0 ? 'Unrated' : bookDetails.rating + '/5'}</span></h2>
                      <h3 class="modal-id">id: <span class="font-weight-normal">${bookDetails.id}</span></h3>
                      </div>`
  modal.showModal()
}

function onCloseModal() {
  _closeModal('.modal')
}

function renderStats() {
  document.querySelector('.expensive-books-count').innerText = getExpensiveBooksCount() + ''
  document.querySelector('.average-books-count').innerText = getAverageBooksCount()
  document.querySelector('.cheap-books-count').innerText = getCheapBooksCount()
}

//Filter & Sort

function onFilterByTitle(titleTxt) {
  gQueryOptions.filterBy.txt = titleTxt
  renderBooks()
  setQueryParams()
}

function onFilterByRating(minRating) {
  gQueryOptions.filterBy.minRating = minRating
  console.log('minRating:', minRating);
  renderBooks()
  setQueryParams()
}

function onClearFilter() {
  gQueryOptions.filterBy = { txt: '', minRating: 0 }

  const elInput = document.querySelector('input[name="book-filter"]')
  const elRating = document.querySelector('.book-filter .min-rating')

  elInput.value = ''
  elRating.value = ''
  setQueryParams()
  renderBooks()
}

function onSetSortBy() {
  const elSortField = document.querySelector('.sort-by select')
  const elSortDirection = document.querySelector('.sort-by input[name="sort-order"]:checked')

  const sortField = elSortField.value
  const sortDir = elSortDirection.value

  gQueryOptions.sortBy = { [sortField]: sortDir }

  renderBooks()
  setQueryParams()
}

//Modals

function _showSucessModal(msg) {
  const elSuccessModal = document.querySelector('.modal-success')
  const strHTML = `<h1>Book has been ${msg} successfully.</h1>`

  elSuccessModal.innerHTML = strHTML
  elSuccessModal.showModal()

  setTimeout(_closeModal, 2000, '.modal-success')
}

function _closeModal(modalClassName) {
  document.querySelector(`${modalClassName}`).close()
}

function _showErrorModal() {
  const elErrorModal = document.querySelector('.modal-error')
  const strHTML = `<h1>One or more details entered is invalid.</h1>`

  elErrorModal.innerHTML = strHTML
  elErrorModal.showModal()

  setTimeout(_closeModal, 2000, '.modal-error')
}

//Query Params

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)
  gQueryOptions.filterBy = {
    txt: queryParams.get('title') || '',
    minRating: queryParams.get('minRating') || '' //todo - check for the other || to see if it should be 0 or "" like the option value
  }
}

function renderQueryParams() {
  document.querySelector('input[name="book-filter"').value = gQueryOptions.filterBy.txt
  document.querySelector('.min-rating').value = gQueryOptions.filterBy.minRating
}

function setQueryParams() {
  const queryParams = new URLSearchParams()

  queryParams.set('title', gQueryOptions.filterBy.txt)
  queryParams.set('minRating', gQueryOptions.filterBy.minRating)

  const newUrl =
    window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + queryParams.toString()
  window.history.pushState({ path: newUrl }, '', newUrl)
}