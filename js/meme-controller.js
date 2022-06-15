'use strict'
var gCanvas
var gCtx
// const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
// var gPos

function init() {
    gCanvas = document.querySelector('.edit-meme-canvas')
    gCtx = gCanvas.getContext('2d')

    renderGallery()
}

function renderMeme() {
    const currMeme = getMeme()
    const img = new Image()
    img.src = getMemeImgSrc(currMeme)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

        currMeme.lines.forEach((line, i) => {
            if (i === currMeme.selectedLineIdx) renderLine(line, true)
            else renderLine(line, false)
        })
    }
}

function renderLine(line, isAddFocus) {
    if (isAddFocus) {
        gCtx.beginPath()
        gCtx.rect(10, line.pos.y - line.size-5, 280, line.size * 1.5)
        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = 'grey'
        gCtx.stroke();
    }
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    gCtx.lineWidth = 0.5;
    gCtx.strokeStyle = 'black';
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
}

function setLineText(elLineTxt) {
    updateMemeLineText(elLineTxt.value)
    renderMeme()
}

function onChangeFontSize(fontDiff) {
    updateMemeLineSize(fontDiff)
    renderMeme()
}

function onChangeColor(elColorPicker) {
    updateMemeLineColor( elColorPicker.value)
    renderMeme()
}

function onSwitchLine(){
    updateLineIdx()
    renderMeme()
}

function onAddLine(){
    addLine()
    renderMeme()
}

function onDeleteLine(){
    deleteFocusedLine()
    renderMeme()
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}