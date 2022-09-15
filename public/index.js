const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const ctxScale = {x: 3, y: 3}

const moveSpeed = 1.2

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

class Sprite {
    constructor({ position, image }) {
        this.position = position
        this.image = image
    }

    draw() {
        ctx.drawImage(image, this.position.x, this.position.y)
    }

}

const backgroundImage = new Sprite({
    position: {
        x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
        y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
    }
})

let pressedKey = ''
let startingTile = { x: 0, y: 0}
let destinationTile = { x: 0, y: 0}
let moveDir = ''

function animate() {
    window.requestAnimationFrame(animate)

    backgroundImage.draw()
    
    moveMap()

    let scaledX = roundToTileSize((canvas.width / 2) / ctxScale.x)
    let scaledY = roundToTileSize((canvas.height / 2) / ctxScale.y)

    let sprite_width = 16
    let sprite_height = 20

    ctx.drawImage(playerImage, sprite_width * 1, sprite_height * 0, sprite_width, sprite_height, scaledX, scaledY, sprite_width, sprite_height)
}

animate()

function moveMap() {
    let x = 0
    let y = 0
    let newMovement = true

    //Track if this is a new movement or not
    if (moveDir != '')
        newMovement = false

    if (pressedKey == 'a' && moveDir == '') {
            moveDir = 'left'
    } else if (pressedKey == 'd' && moveDir == '') {
            moveDir = 'right'
    } else if (pressedKey == 's' && moveDir == '') {
            moveDir = 'down'
    } else if (pressedKey == 'w' && moveDir == '') {
            moveDir = 'up'
    }

    if (moveDir != '') {
        if (moveDir == 'left')
            x = 1
        else if (moveDir == 'right')
            x = -1
        else if (moveDir == 'down')
            y = -1
        else if (moveDir == 'up')
            y = 1
    }

    //There is movement taking place
    if (x != 0 || y != 0) {
        if (newMovement)
            startingTile = { x: backgroundImage.position.x, y: backgroundImage.position.y }

        if (x != 0) {
            destinationTile = { x: startingTile.x + (tileSize * x), y: startingTile.y }
            
            if (Math.abs(destinationTile.x - backgroundImage.position.x) < moveSpeed) {
                backgroundImage.position.x = destinationTile.x
                moveDir = ''
            } else {
                backgroundImage.position.x += (moveSpeed * x)
            }
        } else if (y != 0) {
            destinationTile = { x: startingTile.x, y: startingTile.y + (tileSize * y) }

            if (Math.abs(destinationTile.y - backgroundImage.position.y) < moveSpeed) {
                backgroundImage.position.y = destinationTile.y
                moveDir = ''
            } else {
                backgroundImage.position.y += (moveSpeed * y)
            }
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (pressedKey != e.key)
        pressedKey = e.key
})

window.addEventListener('keyup', (e) => {
    if (pressedKey == e.key)
        pressedKey = ''
})