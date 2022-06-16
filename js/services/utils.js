
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function makeId(length = 6) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''
  for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function getRandomSentence(){
  const idx= getRandomIntInclusive(0,14)
  const sentences=[
    "When you eat pizza",
    "when you think CA is easy",
    "i miss for loops",
    "bootstrap is shit",
    "only falafel",
    "when you saw the pinball",
    "have a good day",
    "i dont know what else",
    "think of something",
    "this sprint is crazy",
    "responsivness for the win",
    "When you do git push",
    "i like memes",
    "shawarma is better than pizza",
    "learn grid, it's good",
  ]
  return sentences[idx]
}

