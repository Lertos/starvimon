const canvas = document.querySelector('canvas')
const leftTransitionDiv = document.querySelector('#leftTransitionDiv')
const rightTransitionDiv = document.querySelector('#rightTransitionDiv')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

leftTransitionDiv.style.width = 1024 / 2
leftTransitionDiv.style.height = 576

rightTransitionDiv.style.width = 0
rightTransitionDiv.style.height = 576

leftTransitionDiv.style.left = 1024 / 2 * -1
rightTransitionDiv.style.left = 1024 

gsap.to('#leftTransitionDiv', {
    left: 0,
    duration: 1.5,
})

gsap.to('#rightTransitionDiv', {
    left: 1024 / 2,
    width: 1024 / 2,
    duration: 1.5,
})


const tileSize = 16
const ctxScale = {x: 3, y: 3}

ctx.scale(ctxScale.x, ctxScale.y)
ctx.imageSmoothingEnabled = false

//TODO: Move to player class
const moveSpeed = 1.2

//Load all images
const imagePaths = {
    bg: './img/maps/images/home_island.png',
    fg: './img/maps/images/home_island_fg.png',
    player: './img/characters/human1.png'
}

let loadedCounter = 0

for (const [key, value] of Object.entries(imagePaths)) {
    const img = new Image()
    img.src = value

    img.onload = () => {
        imagePaths[key] = img
        loadedCounter++

        if (loadedCounter == Object.keys(imagePaths).length)
            startGame()
    }
}

let currentMap
let playerSprite

let startTile = { x: 13, y: 19 }

let startPixel = {
    x: (startTile.x * tileSize * -1),
    y: (startTile.y * tileSize * -1)
}

//TODO: This is the players current tile
let currentTile = startTile

let pressedKey = ''
let moveDir = ''
let startingTile = { x: 0, y: 0}
let destinationTile = { x: 0, y: 0}

let battle = {
    initiated: false
}

//For the animation logic
let fps, fpsInterval, startTime, now, then, elapsed

function startGame() {
    let bgImage = new Sprite({
        position: {
            x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
            y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
        },
        image: imagePaths.bg,
        offset: { x: 0, y: 0 },
        frames: {
            maxX: 1,
            maxY: 1,
            currX: 0,
            currY: 0,
        }
    })

    let fgImage = new Sprite({
        position: {
            x: roundToTileSize(startPixel.x + (canvas.width / 2) / ctxScale.x),
            y: roundToTileSize(startPixel.y + (canvas.height / 2) / ctxScale.y)
        },
        image: imagePaths.fg,
        offset: { x: 0, y: 0 },
        frames: {
            maxX: 1,
            maxY: 1,
            currX: 0,
            currY: 0,
        }
    })

    currentMap = new InstanceMap({
        id: 'homeIsland',
        bgImage: bgImage,
        fgImage: fgImage,
        mapSize: { x: 40, y: 30 },
        collisions: colHomeIsland,
        battleZones: zonesHomeIsland
    })

    playerSprite = new Sprite({
        position: {
            x: roundToTileSize((canvas.width / 2) / ctxScale.x),
            y: roundToTileSize((canvas.height / 2) / ctxScale.y)
        },
        image: imagePaths.player,
        offset: { x: 0, y: -4 },
        frames: {
            maxX: 3,
            maxY: 4,
            currX: 1,
            currY: 0,
        }
    })

    startAnimating(60)
}

function roundToTileSize(num) {
    return Math.ceil(num / tileSize) * tileSize;
}

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
        
        currentMap.bgImage.draw()
        playerSprite.draw()
        currentMap.fgImage.draw()

        playerSprite.drawName()

        if (!battle.initiated) {
            currentMap.moveMap()

            playerSprite.moving = moveDir
        } else {
            playerSprite.moving = ''
        }
    }
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