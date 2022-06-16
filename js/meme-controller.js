'use strict'
var gCanvas
var gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gPos
var gCurrLineIdx
var gCurrEmojiId
var gStartPos
var gIsClicked
var gLineOrEmoji = 0

function init() {
    gCanvas = document.querySelector('.edit-meme-canvas')
    gCtx = gCanvas.getContext('2d')

    renderGallery()
    addListeners()
}

function renderMeme(isIncludeFocus = true) {
    const currMeme = getMeme()
    const img = new Image()
    img.src = getMemeImgSrc(currMeme)
    img.onload = () => {
        gCanvas.height = (gCanvas.width * img.height) / img.width
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

        currMeme.lines.forEach((line, i) => {
            if (i === currMeme.selectedLineIdx && gLineOrEmoji === 1 && isIncludeFocus) renderLine(line, true)
            else renderLine(line, false)
        })

        currMeme.emojis.forEach(emoji => {
            if (emoji.emojiId === gCurrEmojiId && gLineOrEmoji === 2 && isIncludeFocus) renderEmoji(emoji, true)
            else renderEmoji(emoji, false)
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

function renderEmoji(emoji, isAddFocus) {
    gCtx.font = `${emoji.size}px Impact`
    gCtx.fillText(emoji.theEmoji, emoji.pos.x, emoji.pos.y)
    if (isAddFocus) {
        gCtx.beginPath()
        gCtx.rect(emoji.pos.x - (emoji.size*0.8), emoji.pos.y - (emoji.size * 1.2), emoji.size * 1.6, emoji.size + emoji.size*0.7)
        gCtx.lineWidth = 1.5
        gCtx.strokeStyle = '#222222'
        gCtx.stroke();
    }
}

function setLineText(elLineTxt) {
    updateMemeLineText(elLineTxt.value)
    renderMeme()
}

function onChangeFontSize(fontDiff) {
    switch (gLineOrEmoji) {
        case 1: updateMemeLineSize(fontDiff)
            break
        case 2: updateMemeEmojiSize(fontDiff,gCurrEmojiId)
            break
    }
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
    addLine(gCanvas.height)
    gLineOrEmoji = 1
    renderMeme()
}

function onDeleteLine() {
    switch (gLineOrEmoji) {
        case 1: deleteFocusedLine()
            break
        case 2: deleteFocusedEmoji(gCurrEmojiId)
            const memeEmojis = getMeme().emojis
            if (memeEmojis.length)
                gCurrEmojiId = memeEmojis[memeEmojis.length - 1].emojiId
            break
    }
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
    const memeEmojis = getMeme().emojis
    gCurrEmojiId = memeEmojis[memeEmojis.length - 1].emojiId
    gLineOrEmoji = 2
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
            gLineOrEmoji = 1
            renderMeme()
            gIsClicked = true
            gStartPos = gPos
        }
    })

    currMeme.emojis.forEach(emoji => {
        if ((emoji.pos.x - (emoji.size) < gPos.x && gPos.x < emoji.pos.x + (emoji.size)) &&
            (emoji.pos.y - emoji.size - 10 < gPos.y && gPos.y < emoji.pos.y + 10)) {
            gCurrEmojiId = emoji.emojiId
            gLineOrEmoji = 2
            renderMeme()
            gIsClicked = true
            gStartPos = gPos
        }
    })
}

function onMove(ev) {
    if (gIsClicked) {
        gPos = getEvPos(ev)
        const dx = gPos.x - gStartPos.x
        const dy = gPos.y - gStartPos.y
        switch (gLineOrEmoji) {
            case 1: updateLinePos(dx, dy, gCurrLineIdx)
                break
            case 2: updateEmojiePos(dx, dy, gCurrEmojiId)
                break
        }
        gStartPos = gPos
        renderMeme()
    }
}

function onUp() {
    document.body.style.cursor = ''
    gIsClicked = false
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
