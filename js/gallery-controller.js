'use strict'

const GALLERY_IMG_WIDTH = 200
var gKeywordSearchCountMap = {
    'funny': 17, 'cat': 1, 'baby': 1, 'man': 10, 'politics': 25, 'disney': 2, 'win': 1, 'sport': 1, 'sunglasses': 1, 'talk': 1, 'putin': 1, 'cartoon': 1, 'dog': 30

}
var gIsMyMemes

function renderGallery(imgs = getImages()) {
    gIsMyMemes = false
    var imgsHtml = imgs.map(img =>
        `<div class="img-container" onClick="onImageSelect(${img.id})">
         <img  class="gallery-img" src="${img.url}">
         </div>` )
    document.querySelector('.gallery-container').innerHTML = `<div class="img-container" onClick="document.querySelector('.file-input').click()">
         <img  class="gallery-img" src="img/upload-photo.png">
         </div>`
    document.querySelector('.gallery-container').innerHTML += imgsHtml.join('')
}

function renderMyMemesGallery() {
    gIsMyMemes = true
    const myMemes = getMyMemes()
    const imgsHtml = myMemes.map(myMeme =>
        `<div class="img-container" onClick="onImageSelect(${myMeme[1].selectedImgId}, '${myMeme[0]}')">
         <img class="gallery-img" src="${getMemeImgSrc(myMeme[1])}">
         </div>`)
    document.querySelector('.gallery-container').innerHTML = imgsHtml.join('')
}

function onShowGallery() {
    renderGallery()
    document.querySelector('.gallery-container').style.display = 'grid'
    document.querySelector('.filters-container').style.display = 'flex'
    document.querySelector('.edit-container').style.display = 'none'
    document.body.classList.remove('menu-open')
}

function onShowMyMemesGallery() {
    renderMyMemesGallery()
    document.querySelector('.gallery-container').style.display = 'grid'
    document.querySelector('.filters-container').style.display = 'flex'
    document.querySelector('.edit-container').style.display = 'none'
    document.body.classList.remove('menu-open')
}

function onImageSelect(imgIdx, myMemeId = '') {
    // Checks if the selected image is my meme or new meme and generate
    if (gIsMyMemes) setMyMeme(myMemeId)
    else setNewMeme(imgIdx)

    renderMeme()
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.filters-container').style.display = 'none'
    document.querySelector('.edit-container').style.display = 'flex'
}

function onSaveMeme() {
    saveCurrMeme()
    onShowMyMemesGallery()
}

function onDeleteMeme() {
    deleteCurrMeme()
    onShowMyMemesGallery()
}

function onShowKeyWordList(elInput) {
    const filteredKeys = Object.keys(gKeywordSearchCountMap)
    filteredKeys.filter(key => key.includes(elInput.value))

    const imgsHtml = filteredKeys.map(key =>
        `<option value="${key}">`)
    document.getElementById('search-list').innerHTML = imgsHtml.join('')
}

function onSearchKeyword(elInput) {
    const filteredImgs = getImagesByFilter(elInput.value)
    renderGallery(filteredImgs)
}

function onAddKeywordCount(elKeyword) {
    // adding keyword count to the map
    const currKeyCount = gKeywordSearchCountMap[elKeyword.innerText]++
    // calculate the text size so it would be acorrding to 'rem'
    if (currKeyCount < 55)
        elKeyword.style.fontSize = (currKeyCount + 17) / 16 + 'rem'
    // showing the filtered gallery by the key word
    const filteredImgs = getImagesByFilter(elKeyword.innerText)
    renderGallery(filteredImgs)
}

function onUploadPhoto(ev) {
    loadImageFromInput(ev, renderUserImg)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    //after we read the file
    reader.onload = function (event) {
        var img = new Image()
        // Render on canvas // run the callBack func , to render the img on the canvas
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result // put the img src from the file we read
    }
    reader.readAsDataURL(ev.target.files[0]) // read the file we picked
}

function renderUserImg(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

    setUserImg(img)
    onImageSelect(0)// image index 0 means the photo is from the user
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}