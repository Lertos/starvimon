const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const ctxScale = {x: 3, y: 3}

ctx.scale(ctxScale.x, ctxScale.y)
ctx.imageSmoothingEnabled = false

const tileSize = 16
const startTile = {x: 13, y: 19}

const startPixel = {
    x: (startTile.x * tileSize * -1),
    y: (startTile.y * tileSize * -1)
}

const image = new Image()
image.src = './img/maps/home_island.png'

const playerImage = new Image()
playerImage.src = './img/characters/human1.png'

image.onload = () => {
    let scaledX = roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x)
    let scaledY = roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)

    ctx.drawImage(image, scaledX, scaledY)

    playerImage.onload = () => {
        let scaledX = roundToTileSize((canvas.width / 2) / ctxScale.x)
        let scaledY = roundToTileSize((canvas.height / 2) / ctxScale.y)

        let sprite_width = 16
        let sprite_height = 20

        ctx.drawImage(playerImage, sprite_width * 1, sprite_height * 0, sprite_width, sprite_height, scaledX, scaledY, sprite_width, sprite_height)
    }
}

function roundToTileSize(num) {
    return Math.ceil(num / tileSize) * tileSize;
}