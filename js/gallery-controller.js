'use strict'

const GALLERY_IMG_WIDTH = 200
var gKeywordSearchCountMap = {
    'funny': 0, 'cat': 0, 'baby': 0, 'man': 0, 'politics': 0, 'disney': 0, 'win': 0, 'sport': 0, 'sunglasses': 0, 'talk': 0, 'putin': 0, 'cartoon': 0, 'dog': 0
}
var gIsMyMemes

function renderGallery(imgs = getImages()) {
    gIsMyMemes = false
    var imgsHtml = imgs.map(img =>
        `<div class="img-container" onClick="onImageSelect(${img.id})">
         <img  class="gallery-img" src="${img.url}">
         </div>` )
    document.querySelector('.gallery-container').innerHTML = imgsHtml.join('')
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

function onImageSelect(imgIdx, myMemeId = '') {
    // Checks if the selected image is my meme or new meme and generate
    if (gIsMyMemes) setMyMeme(myMemeId)
    else setNewMeme(imgIdx)

    renderMeme()
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.filters-container').style.display = 'none'
    document.querySelector('.edit-container').style.display = 'flex'
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

function onSaveMeme() {
    saveCurrMeme()
    renderMyMemesGallery()
    document.querySelector('.gallery-container').style.display = 'grid'
    document.querySelector('.filters-container').style.display = 'flex'
    document.querySelector('.edit-container').style.display = 'none'
}

function onDeleteMeme(){
    deleteCurrMeme()
    renderMyMemesGallery()
    document.querySelector('.gallery-container').style.display = 'grid'
    document.querySelector('.filters-container').style.display = 'flex'
    document.querySelector('.edit-container').style.display = 'none'
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

function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}