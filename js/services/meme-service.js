'use strict'

const STORAGE_KEY = 'memesDB'

// var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gMeme
var gMyMemes// The array includes idx 0 for id, and idx 1 for the meme object
var gCurrMyMemeId
var gIsReEditedMeme

_loadMyMemes()

function setRandomMeme() {
    const imgCount = getImages().length
    const selectedImgId = getRandomIntInclusive(1, imgCount)
    var linesArray = []
    linesArray.push(_createLine({
        txt: getRandomSentence(),
        size: getRandomIntInclusive(25, 40),
        color: getRandomColor(),
        strokeColor: getRandomColor(),
        pos: { x: 250, y: 80 }
    }))
    if (getRandomIntInclusive(0, 1)) {// randmoly sets if rather be second row
        const newLine = _createLine({
            txt: getRandomSentence(), size: getRandomIntInclusive(25, 40),
            color: getRandomColor(), strokeColor: getRandomColor(), pos: { x: 250, y: getImgHeight(selectedImgId) - 50 }
        })
        linesArray.push(newLine)
    }

    gMeme = _createMeme({ selectedImgId, lines: linesArray })
}

function getMeme() {
    return gMeme
}

function getMyMemeById(myMemeId) {
    return gMyMemes.find(myMeme => myMemeId === myMeme[0])
}

function getMemeImgSrc(meme) {
    const imgs = getImages()
    const img = imgs.find(img => meme.selectedImgId === img.id)
    return img.url
}

function getImgHeight(imageId) {
    const img = new Image()
    img.src = getImages()[imageId - 1].url
    const canvasWidth = 500
    return (canvasWidth * img.height) / img.width
}

function getMyMemes() {
    return gMyMemes
}

function getEmojiIdx(id) {
    return gMeme.emojis.findIndex(emoji => emoji.emojiId === id)
}

function updateMemeLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function updateLinePos(dx, dy, gCurrLineIdx) {
    gMeme.lines[gCurrLineIdx].pos.x += dx
    gMeme.lines[gCurrLineIdx].pos.y += dy
}

function updateEmojiePos(dx, dy, currEmojiId) {
    var emojiIdx = getEmojiIdx(currEmojiId)
    gMeme.emojis[emojiIdx].pos.x += dx
    gMeme.emojis[emojiIdx].pos.y += dy
}

function updateMemeLineSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function updateMemeEmojiSize(diff, id) {
    var emojiIdx = getEmojiIdx(id)
    gMeme.emojis[emojiIdx].size += diff
}

function updateMemeLineColor(fontColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = fontColor
}

function updateLineIdx(idx = -1) {
    if (idx === -1) {
        var idx = gMeme.selectedLineIdx
        gMeme.selectedLineIdx = idx + 1 === gMeme.lines.length ? 0 : idx + 1
    } else gMeme.selectedLineIdx = idx
}

function addLine(canvasHeight) {
    // calculating pos for first line, second line and the rest in the middle
    var posY
    switch (gMeme.lines.length) {
        case 0: posY = 50
            break
        case 1: posY = canvasHeight - 50
            break
        default: posY = 20 + canvasHeight / 2
            break
    }
    //creating new line and add it to the lines array
    gMeme.lines.push(_createLine({ pos: { x: 250, y: posY } }))
}

function addEmoji(emoji) {
    const emojiPosX = getRandomIntInclusive(100, 400)
    const emojiPosY = getRandomIntInclusive(100, 400)
    const newEmoji = _createEmoji({ emoji, pos: { x: emojiPosX, y: emojiPosY } })
    gMeme.emojis.push(newEmoji)
}

function deleteFocusedLine() {
    // in case there are no lines left
    if (gMeme.lines.length === 0) return

    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    // In case he want to delete the first line
    if (gMeme.selectedLineIdx !== 0)
        gMeme.selectedLineIdx--
}

function deleteFocusedEmoji(emojiId) {
    // in case there are no lines left
    if (gMeme.emojis.length === 0) return
    const emojiIdx = gMeme.emojis.findIndex(emoji => emoji.emojiId === emojiId)
    gMeme.emojis.splice(emojiIdx, 1)
}

function getImagesByFilter(keyword) {
    let imgsFiltered = []
    getImages().forEach(img => { if (img.keywords.includes(keyword)) imgsFiltered.push(img) })
    return imgsFiltered
}

function setNewMeme(imgIdx) {
    gIsReEditedMeme = false
    gMeme = _createMeme({ selectedImgId: imgIdx })
    const elActionBtns = document.querySelector('.delete-meme-btn')
    elActionBtns.style.display = 'none'
}

function setMyMeme(myMemeId) {
    gCurrMyMemeId = myMemeId
    gIsReEditedMeme = true
    gMeme = getMyMemeById(myMemeId)[1]
    const elActionBtns = document.querySelector('.delete-meme-btn')
    elActionBtns.style.display = 'block'
}

function _createMeme({ selectedImgId, lines = [_createLine({})], emojis = [] }) {
    var meme = {
        selectedImgId,
        selectedLineIdx: 0,
        lines,
        emojis,
    }
    return meme
}

function _createLine({ txt = 'Enter Text Here', size = 40,
    align = 'center', color = 'white', strokeColor = 'black', pos = { x: 250, y: 80 } }) {
    return {
        txt,
        size,
        align,
        color,
        strokeColor,
        pos,
    }
}

function _createEmoji({ emojiId = makeId(), emoji = '', pos = { x: 250, y: 80 } }) {
    return {
        emojiId,
        theEmoji: emoji,
        size: 30,
        pos,
    }
}

function getImages() {
    // gImgs=
    return [
        { id: 1, url: 'meme-imgs/1.jpg', keywords: ['funny', 'politics'] },
        { id: 2, url: 'meme-imgs/2.jpg', keywords: ['cute', 'dog'] },
        { id: 3, url: 'meme-imgs/3.jpg', keywords: ['baby', 'dog'] },
        { id: 4, url: 'meme-imgs/4.jpg', keywords: ['cat', 'cute'] },
        { id: 5, url: 'meme-imgs/5.jpg', keywords: ['baby', 'win'] },
        { id: 6, url: 'meme-imgs/6.jpg', keywords: ['win', 'politics'] },
        { id: 7, url: 'meme-imgs/7.jpg', keywords: ['baby', 'funny'] },
        { id: 8, url: 'meme-imgs/8.jpg', keywords: ['funny', 'man'] },
        { id: 9, url: 'meme-imgs/9.jpg', keywords: ['baby', 'funny'] },
        { id: 10, url: 'meme-imgs/10.jpg', keywords: ['funny', 'politics'] },
        { id: 11, url: 'meme-imgs/11.jpg', keywords: ['sport', 'man'] },
        { id: 12, url: 'meme-imgs/12.jpg', keywords: ['man', 'win'] },
        { id: 13, url: 'meme-imgs/13.jpg', keywords: ['man', 'win'] },
        { id: 14, url: 'meme-imgs/14.jpg', keywords: ['sunglasses', 'man'] },
        { id: 15, url: 'meme-imgs/15.jpg', keywords: ['talk', 'man'] },
        { id: 16, url: 'meme-imgs/16.jpg', keywords: ['man', 'funny'] },
        { id: 17, url: 'meme-imgs/17.jpg', keywords: ['politics', 'putin'] },
        { id: 18, url: 'meme-imgs/18.jpg', keywords: ['cartoon', 'disney'] },
    ]
}

function saveCurrMeme() {
    if (gIsReEditedMeme) {
        const currMyMemeIdx = gMyMemes.findIndex(myMeme => myMeme[0] === gCurrMyMemeId)
        gMyMemes[currMyMemeIdx] = [gCurrMyMemeId, gMeme]
    } else gMyMemes.push([makeId(), gMeme])

    _saveMemesToStorage()
}

function deleteCurrMeme() {
    const currMyMemeIdx = gMyMemes.findIndex(myMeme => myMeme[0] === gCurrMyMemeId)
    gMyMemes.splice(currMyMemeIdx, 1)

    _saveMemesToStorage()
}

function _loadMyMemes() {
    gMyMemes = loadFromStorage(STORAGE_KEY)
    if (!gMyMemes) gMyMemes = []
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMyMemes)
}
