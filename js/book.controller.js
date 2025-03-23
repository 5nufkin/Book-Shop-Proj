'use strict'

function onInit() {
  renderBooks()
}

function renderBooks() {
  const books = getBooks()
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
  const strHTML = `<td colspan="3"><h1 class="no-books-found">No matching books were found...</h1></td>`
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
  if (bookName.length && bookPrice > 0) {
    addBook(bookName, bookPrice)
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
                      <h2 class="modal-price">Price: <span class="font-weight-normal">${bookDetails.price}</span>$</h2>
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

function onFilterBy() {
  const elInput = document.querySelector('input[name="book-filter"]')
  const elInputValue = elInput.value
  filterBy(elInputValue)
  renderBooks()
}

function onClearFilter() {
  const elInput = document.querySelector('input[name="book-filter"]')
  elInput.value = ''
}

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