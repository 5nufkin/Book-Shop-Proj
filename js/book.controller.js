'use strict'

const gQueryOptions = {
  filterBy: { txt: '', minRating: 0 },
  sortBy: {},
  page: { idx: 0, size: 3 }
}

function onInit() {
  readQueryParams()
  renderQueryParams()
  renderBooks()
  renderCurrPage()
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
  gQueryOptions.page.idx = 0
  renderBooks()
  setQueryParams()
}

function onFilterByRating(minRating) {
  gQueryOptions.filterBy.minRating = minRating
  gQueryOptions.page.idx = 0
  renderBooks()
  setQueryParams()
}

function onClearFilter() {
  gQueryOptions.filterBy = { txt: '', minRating: 0 }

  const elInput = document.querySelector('input[name="book-filter"]')
  const elRating = document.querySelector('.book-filter .min-rating')
  const elSortBy = document.querySelector('.sort-by select')

  elInput.value = ''
  elRating.value = 0
  elSortBy.value = ''

  gQueryOptions.page.idx = 0
  setQueryParams()
  renderBooks()
}

function onSetSortBy() {
  const elSortField = document.querySelector('.sort-by select')
  const elSortDirection = document.querySelector('.sort-by input[name="sort-order"]:checked')

  const sortField = elSortField.value
  const sortDir = elSortDirection.value

  gQueryOptions.sortBy = { [sortField]: sortDir }

  gQueryOptions.page.idx = 0
  renderBooks()
  setQueryParams()
}

//Naviagte Pages

function onNextPage() {
  const pageCount = getPageCount(gQueryOptions)

  if (gQueryOptions.page.idx === pageCount - 1) {
    gQueryOptions.page.idx = 0
  } else {
    gQueryOptions.page.idx++
  }


  renderCurrPage()
  renderBooks()
}

function onPrevPage() {
  const pageCount = getPageCount(gQueryOptions)

  if (gQueryOptions.page.idx === 0) {
    gQueryOptions.page.idx = pageCount - 1
  } else {
    gQueryOptions.page.idx--
  }
  renderCurrPage()
  renderBooks()
}

function renderCurrPage() {
  const elCurrPage = document.querySelector('.current-page')
  elCurrPage.innerText = `${gQueryOptions.page.idx + 1}`
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
//Todo - add support for options I added 

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)
  gQueryOptions.filterBy = {
    txt: queryParams.get('title') || '',
    minRating: queryParams.get('minRating') || 0
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