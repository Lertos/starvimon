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

const bgImage = new Image()
bgImage.src = './img/maps/home_island.png'

const playerImage = new Image()
playerImage.src = './img/characters/human1.png'

function roundToTileSize(num) {
    return Math.ceil(num / tileSize) * tileSize;
}

class Sprite {
    constructor({ position, image, frames }) {
        this.position = position
        this.image = image
        this.frames = frames
    }

    draw() {
        //ctx.drawImage(image, this.position.x, this.position.y)
        let spriteWidth = this.image.width / this.frames.maxX
        let spriteHeight = this.image.height / this.frames.maxY

        ctx.drawImage(
            this.image, 
            spriteWidth * this.frames.currX, //Crop X
            spriteHeight * this.frames.currY, //Crop Y
            spriteWidth, //Crop Width
            spriteHeight, //Crop Height
            this.position.x, 
            this.position.y, 
            spriteWidth,
            spriteHeight
        )
    }

}

const backgroundSprite = new Sprite({
    position: {
        x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
        y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
    },
    image: bgImage,
    frames: {
        maxX: 1,
        maxY: 1,
        currX: 0,
        currY: 0,
    }
})

const playerSprite = new Sprite({
    position: {
        x: roundToTileSize((canvas.width / 2) / ctxScale.x),
        y: roundToTileSize((canvas.height / 2) / ctxScale.y)
    },
    image: playerImage,
    frames: {
        maxX: 3,
        maxY: 4,
        currX: 1,
        currY: 0,
    }
})

let pressedKey = ''
let startingTile = { x: 0, y: 0}
let destinationTile = { x: 0, y: 0}
let moveDir = ''

function animate() {
    window.requestAnimationFrame(animate)

    backgroundSprite.draw()
    playerSprite.draw()

    moveMap()
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
            startingTile = { x: backgroundSprite.position.x, y: backgroundSprite.position.y }

        if (x != 0) {
            destinationTile = { x: startingTile.x + (tileSize * x), y: startingTile.y }
            
            if (Math.abs(destinationTile.x - backgroundSprite.position.x) < moveSpeed) {
                backgroundSprite.position.x = destinationTile.x
                moveDir = ''
            } else {
                backgroundSprite.position.x += (moveSpeed * x)
            }
        } else if (y != 0) {
            destinationTile = { x: startingTile.x, y: startingTile.y + (tileSize * y) }

            if (Math.abs(destinationTile.y - backgroundSprite.position.y) < moveSpeed) {
                backgroundSprite.position.y = destinationTile.y
                moveDir = ''
            } else {
                backgroundSprite.position.y += (moveSpeed * y)
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