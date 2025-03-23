'use strict'

//Model
var gBooks = []
const STORAGE_KEY = 'booksDB'
var gFilterBy
_createBooks()

function getBooks() {
  if (!gFilterBy) return gBooks

  return gBooks.filter(book => book.title.toLowerCase().includes(gFilterBy.toLowerCase()))
}

function getBook(bookId) {
  return gBooks.find(book => book.id === bookId)
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
  _saveBooks()
}

function updatePrice(bookId, newPrice) {
  const book = getBook(bookId)
  book.price = newPrice
  _saveBooks()
  // return book
}

function addBook(title, price) {
  gBooks.push(_createBook(title, price))
  _saveBooks()
}

function _createBook(title, price, imgUrl, rating = 0) {
  return { id: getRandomId(6), title, price, imgUrl: imgUrl || 'img/blankBook.jpg', rating }
}

function _createBooks() {

  gBooks = loadFromStorage(STORAGE_KEY)

  if (!gBooks || !gBooks.length) {

    gBooks = [
      _createBook('The adventures of Lori Ipsi', 120, 0, 5),
      _createBook('World Atlas', 300, 'img/atlas.jpg'),
      _createBook('Zobra the Greek', 87, 'img/zorba.jpg', 2)
    ]

    _saveBooks()
  }
}

function _saveBooks() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function filterBy(filter) {
  gFilterBy = filter + ''
}

function getExpensiveBooksCount() {
  return gBooks.filter(book => book.price >= 200).length
}

function getAverageBooksCount() {
  return gBooks.filter(book => book.price < 200 && book.price >= 80).length
}

function getCheapBooksCount() {
  return gBooks.filter(book => book.price < 80).length
}