'use strict'

function getRandomId(length = 6) {
  var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charsLength = chars.length;
  var randomId = '';
  

  for(var i=0; i<length; i++) {
    randomId += chars[Math.floor(Math.random() * charsLength)];
  }

  return randomId;
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}