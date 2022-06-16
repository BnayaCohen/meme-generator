'use strict'
var gCanvas
var gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gPos
var gCurrLineIdx

function init() {
    gCanvas = document.querySelector('.edit-meme-canvas')
    gCtx = gCanvas.getContext('2d')

    renderGallery()
    addListeners()
}

function renderMeme(isIncludeFocusLine = true) {
    const currMeme = getMeme()
    const img = new Image()
    img.src = getMemeImgSrc(currMeme)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

        currMeme.lines.forEach((line, i) => {
            if (i === currMeme.selectedLineIdx && isIncludeFocusLine) renderLine(line, true)
            else renderLine(line, false)
        })

        currMeme.emojis.forEach(emoji => {
            gCtx.font = `30px`
            gCtx.fillText(emoji.theEmoji, emoji.pos.x, emoji.pos.y)
        })
    }
}

function renderLine(line, isAddFocus) {

    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align
    if (isAddFocus) {
        gCtx.beginPath()
        const txtWidth = gCtx.measureText(line.txt).width
        gCtx.rect(line.pos.x - (txtWidth / 2) - 30, line.pos.y - line.size - 5, txtWidth + 60, line.size * 1.5)
        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = '#222222'
        gCtx.stroke();
    }
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = line.strokeColor;
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
    updateMemeLineColor(elColorPicker.value)
    renderMeme()
}

function onSwitchLine() {
    updateLineIdx()
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onDeleteLine() {
    deleteFocusedLine()
    renderMeme()
}

function onImFlexible() {
    setRandomMeme()
    renderMeme()
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.filters-container').style.display = 'none'
    document.querySelector('.edit-container').style.display = 'flex'
}

function onAddEmoji(emoji) {
    addEmoji(emoji)
    renderMeme()
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL('image/jpeg')
    elLink.href = data
}

function onPrepToDownload() {
    renderMeme(false)
}

function onLeaveDownload() {
    renderMeme()// back to the last canvas
}

function onShareMeme() {
    renderMeme(false)
    uploadImg()
}

//handle the listeners
function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    document.body.style.cursor = 'pointer'
    gPos = getEvPos(ev)
    const currMeme = getMeme()
    currMeme.lines.forEach((line, i) => {
        const txtWidth = gCtx.measureText(line.txt).width
        if (((line.pos.x - (txtWidth / 2)) < gPos.x && gPos.x < line.pos.x + (txtWidth / 2)) &&
            (line.pos.y - line.size - 5 < gPos.y && gPos.y < line.pos.y + (line.size * 1.5))) {
            updateLineIdx(i)
            gCurrLineIdx = i
            renderMeme()
        }
    })
    // gIsClicked = true
}

function onMove(ev) {
    gPos = getEvPos(ev)
    
}

function onUp() {
    document.body.style.cursor = ''
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0] //gets the first touch point
        //calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
