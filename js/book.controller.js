'use strict'

function onInit() {
  renderBooks()
}

function renderBooks() {
  const books = getBooksToDisplay()
  var strHTMLs = books.map(book => `<tr>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>
          <button class="btn btn-read">Read</button>
          <button class="btn btn-update" onclick="onUpdateBook('${book.id}')>Update</button>
          <button class="btn btn-delete" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>`)
  
  document.querySelector('.books-table tbody').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onUpdateBook(bookId) {
  
}