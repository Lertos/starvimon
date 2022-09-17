const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const ctxScale = {x: 3, y: 3}

const moveSpeed = 1.2

ctx.scale(ctxScale.x, ctxScale.y)
ctx.imageSmoothingEnabled = false

const tileSize = 16
//TODO: This should come from the map; when logging in, entering a new map, etc
const startTile = {x: 13, y: 19}
let currentTile = startTile

const mapCollisions = []

//TODO: Change the i+ value to the amount of horz tiles from the Map object 
for (let i=0; i<colHomeIsland.length; i+=40) {
    mapCollisions.push(colHomeIsland.slice(i, 40 + i))
}

const mapBattleZones = []

//TODO: Change the i+ value to the amount of horz tiles from the Map object 
for (let i=0; i<zonesHomeIsland.length; i+=40) {
    mapBattleZones.push(zonesHomeIsland.slice(i, 40 + i))
}


const startPixel = {
    x: (startTile.x * tileSize * -1),
    y: (startTile.y * tileSize * -1)
}

const bgImage = new Image()
bgImage.src = './img/maps/home_island.png'

const fgImage = new Image()
fgImage.src = './img/maps/home_island_fg.png'

const playerImage = new Image()
playerImage.src = './img/characters/human1.png'

function roundToTileSize(num) {
    return Math.ceil(num / tileSize) * tileSize;
}

const backgroundSprite = new Sprite({
    position: {
        x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
        y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
    },
    image: bgImage,
    offset: { x: 0, y: 0 },
    frames: {
        maxX: 1,
        maxY: 1,
        currX: 0,
        currY: 0,
    }
})

const foregroundSprite = new Sprite({
    position: {
        x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
        y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
    },
    image: fgImage,
    offset: { x: 0, y: 0 },
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
    offset: { x: 0, y: -4 },
    frames: {
        maxX: 3,
        maxY: 4,
        currX: 1,
        currY: 0,
    }
})

//Add any object that should be moved along with the map
let movingSprites = [backgroundSprite, foregroundSprite]

let pressedKey = ''
let startingTile = { x: 0, y: 0}
let destinationTile = { x: 0, y: 0}
let moveDir = ''

//Animation

let fps, fpsInterval, startTime, now, then, elapsed

startAnimating(60)

function startAnimating(fps) {
    fpsInterval = 1000 / fps
    then = window.performance.now()
    startTime = then
    animate()
}

function animate(newTime) {
    window.requestAnimationFrame(animate)

    //Calculate the time elapsed since last loop
    now = newTime
    elapsed = now - then

    //If the next frame is ready, draw
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)
        
        backgroundSprite.draw()
        playerSprite.draw()
        foregroundSprite.draw()

        playerSprite.drawName()

        moveMap()

        playerSprite.moving = moveDir
    }
}

animate()

function moveMap() {
    let x = 0
    let y = 0
    let newMovement = true

    //Track if this is a new movement or not
    if (moveDir != '')
        newMovement = false

    setNewDirection()

    let directionValues = getDirectionValue()

    x = directionValues.x
    y = directionValues.y

    //There is movement taking place
    if (x != 0 || y != 0) {
        if (newMovement)
            startingTile = { x: backgroundSprite.position.x, y: backgroundSprite.position.y }

        let possibleTile = { x: currentTile.x - x , y: currentTile.y - y }

        if (isBlocked(possibleTile)) {
            moveDir = ''
            return
        }

        destinationTile = { x: startingTile.x + (tileSize * x), y: startingTile.y + (tileSize * y) }

        if (x != 0) {
            if (Math.abs(destinationTile.x - backgroundSprite.position.x) < moveSpeed) {
                setPositionOfMapLayers(destinationTile.x, 0)
                moveDir = ''
                currentTile.x -= x
            } else {
                setPositionOfMapLayers(backgroundSprite.position.x + (moveSpeed * x), 0)
            }
        } else if (y != 0) {
            if (Math.abs(destinationTile.y - backgroundSprite.position.y) < moveSpeed) {
                setPositionOfMapLayers(0, destinationTile.y)
                moveDir = ''
                currentTile.y -= y
            } else {
                setPositionOfMapLayers(0, backgroundSprite.position.y + (moveSpeed * y))
            }
        }
    }
}

function setPositionOfMapLayers(x, y) {
    if (x != 0) {
        for (i = 0; i < movingSprites.length; i++)
            movingSprites[i].position.x = x
    } else if (y != 0) {
        for (i = 0; i < movingSprites.length; i++)
            movingSprites[i].position.y = y
    }
}

function setNewDirection() {
    if (pressedKey == 'a' && moveDir == '') {
        moveDir = 'left'
    } else if (pressedKey == 'd' && moveDir == '') {
        moveDir = 'right'
    } else if (pressedKey == 's' && moveDir == '') {
        moveDir = 'down'
    } else if (pressedKey == 'w' && moveDir == '') {
        moveDir = 'up'
    }
}

function getDirectionValue() {
    let directions = { x: 0, y: 0 }

    if (moveDir != '') {
        if (moveDir == 'left')
            directions.x = 1
        else if (moveDir == 'right')
            directions.x = -1
        else if (moveDir == 'down')
            directions.y = -1
        else if (moveDir == 'up')
            directions.y = 1
    }

    return directions
}

function isBlocked(tile) {
    var tileType = mapCollisions[tile.y][tile.x]

    if (tileType == 0)
        return false
    return true
}

window.addEventListener('keydown', (e) => {
    if (pressedKey != e.key)
        pressedKey = e.key
})

window.addEventListener('keyup', (e) => {
    if (pressedKey == e.key) {
        pressedKey = ''
        playerSprite.finishingMove = true
    }
})