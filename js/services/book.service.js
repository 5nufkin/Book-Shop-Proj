'use strict'

//Model
var gBooks = []
const STORAGE_KEY = 'booksDB'
var gFilterBy
_createBooks()

function getBooks(options) {

  const filterBy = options.filterBy
  const sortBy = options.sortBy
  const page = options.page

  var books = _filterBooks(filterBy)

  books = _sortBooks(books, sortBy)

  const startIdx = page.idx * page.size
  books = books.slice(startIdx, startIdx + page.size)

  return books
}

function getPageCount(options) {
  const page = options.page
  const filterBy = options.filterBy

  const books = _filterBooks(filterBy)

  const pageCount = Math.ceil(books.length / page.size)

  return pageCount
}

function _sortBooks(books, sortBy) {

  if (sortBy.title) {
    const sortDir = sortBy.title
    return books.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortDir)

  } else if (sortBy.price) {
    const sortDir = sortBy.price
    return books.sort((b1, b2) => (b1.price - b2.price) * sortDir)

  } else if (sortBy.rating) {
    const sortDir = sortBy.rating
    return books.sort((b1, b2) => (b1.rating - b2.rating) * sortDir)
  }

  return books
}

function _filterBooks(filterBy) {
  var books = gBooks
  if (filterBy.txt) books = books.filter(book => book.title.toLowerCase().includes(gQueryOptions.filterBy.txt.toLowerCase()))
  if (filterBy.minRating) books = books.filter(book => book.rating >= filterBy.minRating)
  return books
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

function addBook(title, price, rating, imgUrl) {
  gBooks.push(_createBook(title, price, rating, imgUrl))
  _saveBooks()
}

function updateBook(bookId, title, price, rating, imgUrl) {
  const book = getBook(bookId)
  book.title = title
  book.price = price
  book.rating = rating
  book.imgUrl = imgUrl?imgUrl:'img/blankBook.jpg'
}

function _createBook(title, price, rating = 0, imgUrl) {
  rating = +rating
  return { id: getRandomId(6), title, price, imgUrl: imgUrl || 'img/blankBook.jpg', rating: rating || 0 }
}

function _createBooks() {

  gBooks = loadFromStorage(STORAGE_KEY)

  if (!gBooks || !gBooks.length) {

    gBooks = [
      _createBook('The adventures of Lori Ipsi', 120, 0),
      _createBook('World Atlas', 300, 5, 'img/atlas.jpg'),
      _createBook('Zobra the Greek', 87, 3, 'img/zorba.jpg', 2),
    ]
    for (var i = 0; i < 6; i++) {
      gBooks.push(_createBook(`Harry Potter ${i + 1}`, getRandomIntInclusive(50, 270), getRandomIntInclusive(1, 5), `img/Harry_potter_${i + 1}.jpg`))
    }

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