'use strict'

var gImgs

function renderGallery() {
    gImgs =getImages()
    var imgsHtml = gImgs.map(img =>
        `<div class="img-container" onClick="onImageSelect(${img.id})">
         <img class="gallery-img" src="${img.url}">
         </div>`)
    document.querySelector('.gallery-container').innerHTML = imgsHtml.join('')
}

function onImageSelect(imgIdx) {
    setImg(imgIdx)
    renderMeme()
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.filters-container').style.display = 'none'
    document.querySelector('.edit-container').style.display = 'flex'
}

