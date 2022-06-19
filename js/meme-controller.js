'use strict'
var gCanvas
var gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gPos
var gCurrLineIdx
var gCurrEmojiId
var gStartPos
var gIsClicked
var gIsExpandingTxt
var gIsRotatingTxt
var gLineOrEmoji = 1

function init() {
    gCanvas = document.querySelector('.edit-meme-canvas')
    gCtx = gCanvas.getContext('2d')

    // set the keywords sizes in the filter area
    const filterKeywords = document.querySelectorAll('.filter-keywords p')
    filterKeywords.forEach(elKeyword => {
        const currKeyCount = gKeywordSearchCountMap[elKeyword.innerText]
        elKeyword.style.fontSize = (currKeyCount + 17) / 16 + 'rem'
    })

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
    // gCtx.translate( line.pos.x, line.pos.y);
    // gCtx.rotate(line.rotation * (Math.PI/180));

    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align
    gCtx.fillText(line.txt, line.pos.x,line.pos.y)
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = line.strokeColor;
    gCtx.strokeText(line.txt, line.pos.x,line.pos.y)
    if (!isAddFocus) return
    
    gCtx.beginPath()
    const txtWidth = gCtx.measureText(line.txt).width
    gCtx.rect(line.pos.x - (txtWidth / 2) - 30, line.pos.y - line.size - 5, txtWidth + 60, line.size * 1.5)
    gCtx.lineWidth = 1.5
    gCtx.strokeStyle = '#222222'
    gCtx.stroke();
    gCtx.fillStyle = 'blue'
    gCtx.fillRect( line.pos.x+(txtWidth / 2) + 20, line.pos.y - 25 + line.size / 1.6, 20, 20)
    // gCtx.beginPath()
    // gCtx.fillStyle = 'red'
    // gCtx.arc(line.pos.x, line.pos.y - line.size - 16, 10, 0, 2 * Math.PI)
    // gCtx.fill();
    // gCtx.translate( -line.pos.x, -line.pos.y);
}

function renderEmoji(emoji, isAddFocus) {
    gCtx.font = `${emoji.size}px Impact`
    gCtx.fillText(emoji.theEmoji, emoji.pos.x, emoji.pos.y)
    if (!isAddFocus) return
    gCtx.beginPath()
    gCtx.rect(emoji.pos.x - (emoji.size * 0.8), emoji.pos.y - (emoji.size * 1.2), emoji.size * 1.6, emoji.size + emoji.size * 0.7)
    gCtx.lineWidth = 1.5
    gCtx.strokeStyle = '#222222'
    gCtx.stroke();
    gCtx.fillStyle = 'blue'
    gCtx.fillRect(emoji.pos.x - (emoji.size * 0.8) + 20 + emoji.size * 1.6 - 28, emoji.pos.y - (emoji.size * 1.2) + emoji.size + emoji.size * 0.7 - 11, 20, 20)
}

function onSetLineText(elLineTxt) {
    updateMemeLineText(elLineTxt.value)
    renderMeme()
}

function onChangeFontSize(diff) {
    switch (gLineOrEmoji) {
        case 1: updateMemeLineSize(diff)
            break
        case 2: updateMemeEmojiSize(diff, gCurrEmojiId)
            break
    }
    renderMeme()
}

function onMoveText(diff) {
    switch (gLineOrEmoji) {
        case 1: updateLinePos(0, diff, gCurrLineIdx)
            break
        case 2: updateEmojiePos(0, diff, gCurrEmojiId)
            break
    }
    renderMeme()
}

function onChangeColor(elColorPicker) {
    updateMemeLineColor(elColorPicker.value)
    renderMeme()
}

function onChangeStroke(elColorPicker) {
    updateMemeLineStrokeColor(elColorPicker.value)
    renderMeme()
}

function onTextToUpperCase() {
    updateTextToUppercase()
    renderMeme()
}

function onChangeFont(elSelector) {
    updateMemeLineFont(elSelector.value)
    renderMeme()
}

function onSwitchLine() {
    gLineOrEmoji = 1
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
    document.querySelector('.delete-meme-btn').style.display = 'none'
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

//ACTION FUNCTIONS
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

//MOUSE FUNCTIONS
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
        gCtx.font = `${line.size}px ${line.font}`
        const txtWidth = gCtx.measureText(line.txt).width
        if (((line.pos.x - (txtWidth / 2)) < gPos.x && gPos.x < line.pos.x + (txtWidth / 2)-15) &&
            (line.pos.y - line.size - 5 < gPos.y && gPos.y < line.pos.y + (line.size * 0.4))) {
            updateLineIdx(i)
            gCurrLineIdx = i
            gLineOrEmoji = 1
            gIsClicked = true
            renderMeme()
        }
    })

    currMeme.emojis.forEach(emoji => {
        if ((emoji.pos.x - (emoji.size) < gPos.x && gPos.x < emoji.pos.x + (emoji.size)) &&
            (emoji.pos.y - emoji.size - 10 < gPos.y && gPos.y < emoji.pos.y + 10)) {
            gCurrEmojiId = emoji.emojiId
            gLineOrEmoji = 2
            gIsClicked = true
            renderMeme()
        }
    })

    if (gIsClicked) return

    switch (gLineOrEmoji) {
        case 1:
            const currSelectedLine = currMeme.lines[gCurrLineIdx]
            gCtx.font = `${currSelectedLine.size}px ${currSelectedLine.font}`
            const txtWidth = gCtx.measureText(currSelectedLine.txt).width
            gCtx.beginPath()
            gCtx.rect(currSelectedLine.pos.x + (txtWidth / 2) + 20, currSelectedLine.pos.y - 25 + currSelectedLine.size / 1.6, 20, 20)
            break
        case 2: const currEmoji = currMeme.emojis[getEmojiIdx(gCurrEmojiId)]
        gCtx.font = `${currEmoji.size}px`
            gCtx.rect(currEmoji.pos.x - (currEmoji.size * 0.8) + 20 + currEmoji.size * 1.6 - 28, currEmoji.pos.y - (currEmoji.size * 1.2) + currEmoji.size + currEmoji.size * 0.7 - 11, 20, 20)
            break
    }
    if (gCtx.isPointInPath(gPos.x, gPos.y))
    // console.log(ev);
        gIsExpandingTxt = true

    // if (gIsExpandingTxt) return
    // const currSelectedLine = currMeme.lines[currMeme.selectedLineIdx]
    // const txtWidth = gCtx.measureText(currSelectedLine.txt).width
    // gCtx.beginPath()
    // gCtx.arc(currSelectedLine.pos.x, currSelectedLine.pos.y - currSelectedLine.size - 16, 10, 0, 2 * Math.PI)
    // if (gCtx.isPointInPath(gPos.x, gPos.y))
    //     gIsRotatingTxt = true
}

function onMove(ev) {
    if (gIsClicked) {
        gStartPos = gPos
        gPos = getEvPos(ev)
        const dx = gPos.x - gStartPos.x
        const dy = gPos.y - gStartPos.y
        switch (gLineOrEmoji) {
            case 1: updateLinePos(dx, dy, gCurrLineIdx)
                break
            case 2: updateEmojiePos(dx, dy, gCurrEmojiId)
                break
        }
        renderMeme()
    }

    // if (gIsClicked) return

    if (gIsExpandingTxt) {
        gStartPos = gPos
        gPos = getEvPos(ev)
        const dx = gPos.x - gStartPos.x
        switch (gLineOrEmoji) {
            case 1: updateMemeLineSize(dx / 2.2)
                break
            case 2: updateMemeEmojiSize(dx, gCurrEmojiId)
                break
        }
        renderMeme()
    }

    // if (gIsExpandingTxt) return

    // if (gIsRotatingTxt) {
    //     gStartPos = gPos
    //     gPos = getEvPos(ev)
    //     const dx = gPos.x - gStartPos.x
    //     // switch (gLineOrEmoji) {
    //     //     case 1: updateMemeLineSize(dx / 2.2)
    //     //         break
    //     //     case 2: updateMemeEmojiSize(dx, gCurrEmojiId)
    //     //         break
    //     // }
    //     updateMemeLineRotation(dx) 
    //     renderMeme()
    // }
}

function onUp() {
    document.body.style.cursor = ''
    gIsClicked = false
    gIsExpandingTxt = false
    // gIsRotatingTxt = false
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