'use strict'

//Model
const gBooks = [
  { id: getRandomId(6), title: 'The adventures of Lori Ipsi', price: 120, imgUrl: 'img/blankBook.jpg' },
  { id: getRandomId(6), title: 'World Atlas', price: 300, imgUrl: 'img/atlas.jpg' },
  { id: getRandomId(6), title: 'Zorba the Greek', price: 87, imgUrl: 'img/zorba.jpg' }
]

function getBooks() {
  return gBooks
}

function getBook(bookId) {
  return gBooks.find(book => book.id === bookId)
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
}

function updatePrice(bookId, newPrice) {
  const book = getBook(bookId)
  book.price = newPrice
  // return book
}

function addBook(title, price) {
  gBooks.push(_createBook(title,price))
}

function _createBook(title, price, imgUrl) {
  return { id: getRandomId(6), title, price, imgUrl: imgUrl||'img/blankBook.jpg' }
}
