'use strict'

function onInit() {
  renderBooks()
}

function renderBooks() {
  const books = getBooks()
  var strHTMLs = books.map(book => `<tr>
        <td>${book.title}</td>
        <td>${book.price}$</td>
        <td>
          <button class="btn btn-read" onclick="onSeeDetails('${book.id}')">Read</button>
          <button class="btn btn-update" onclick="onUpdateBook('${book.id}')">Update</button>
          <button class="btn btn-delete" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>`)

  document.querySelector('.book-table tbody').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = prompt('Enter new book price:')
  updatePrice(bookId, newPrice)
  renderBooks()
}

function onAddBook() {
  const bookName = prompt('Enter book name:')
  const bookPrice = prompt('Enter book price:')
  addBook(bookName, bookPrice)
  renderBooks()
}

function onSeeDetails(bookId) {
  const bookDetails = getBook(bookId)
  const modal = document.querySelector('.modal ')
  console.log(modal)
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
  document.querySelector('.modal').close()
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