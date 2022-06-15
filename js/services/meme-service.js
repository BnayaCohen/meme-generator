'use strict'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gImgs
var gMeme

_createImages()

function getMeme() {
    return gMeme
}

function getMemeImgSrc(meme) {
    const img = gImgs.find(img => meme.selectedImgId === img.id)
    return img.url
}

function updateMemeLineText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function updateMemeLineSize(fontDiff) {
    gMeme.lines[gMeme.selectedLineIdx].size += fontDiff
}

function updateMemeLineColor(fontColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = fontColor
}

function updateLineIdx() {
    var idx = gMeme.selectedLineIdx
    gMeme.selectedLineIdx = idx + 1 === gMeme.lines.length ? 0 : idx + 1
}

function addLine() {
    // calculating pos for first line, second line and the rest in the middle
    var posY
    switch (gMeme.lines.length) {
        case 0: posY = 50
            break
        case 1: posY = 250
            break
        default: posY = 150
            break
    }
    //creating new line
    var newLine = {
        txt: 'Enter Text Here',
        size: 25,
        align: 'center',
        color: 'white',
        pos: { x: 150, y: posY }
    }
    gMeme.lines.push(newLine)
}

function deleteFocusedLine() {
    // in case there are no lines left
    if (gMeme.lines.length === 0) return

    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    // In case he want to delete the first line
    if (gMeme.selectedLineIdx !== 0)
        gMeme.selectedLineIdx--
}

function getImages() {
    return gImgs
}

function setImg(imgIdx) {
    gMeme = _createMeme(imgIdx)
}

function _createMeme(imgIdx) {
    var meme = {
        selectedImgId: imgIdx,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Enter Text Here',
            size: 25,
            align: 'center',
            color: 'white',
            pos: { x: 150, y: 50 }
        },
        {
            txt: 'Enter Text Here',
            size: 25,
            align: 'center',
            color: 'blue',
            pos: { x: 150, y: 250 }
        },
        ]
    }
    return meme
}

function _createImages() {
    gImgs = [
        { id: 1, url: 'meme-imgs/1.jpg', keywords: ['funny', 'politics'] },
        { id: 2, url: 'meme-imgs/2.jpg', keywords: ['cute', 'dog'] },
        { id: 3, url: 'meme-imgs/3.jpg', keywords: ['baby', 'dog'] },
        { id: 4, url: 'meme-imgs/4.jpg', keywords: ['baby', 'dog'] },
        { id: 5, url: 'meme-imgs/5.jpg', keywords: ['baby', 'dog'] },
    ]
}