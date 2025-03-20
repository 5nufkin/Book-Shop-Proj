'use strict'

//Model
const gBooks = [
  { id: getRandomId(6), title: 'The adventures of Lori Ipsi', price: 120, imgUrl: 'lori-ipsi.jpg' },
  { id: getRandomId(6), title: 'World Atlas', price: 300, imgUrl: 'atlas.jpg' },
  { id: getRandomId(6), title: 'Zobar the Greek', price: 87, imgUrl: 'zobar.jpg' }
]

function getBooksToDisplay() {
  return gBooks
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
}