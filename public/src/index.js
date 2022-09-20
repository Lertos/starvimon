const tileSize = 16

//TODO: Move to player class
let walkSpeed = 1.2
let runSpeed = 2

//Load all images
const imagePaths = {
    bg: './img/maps/images/home_island.png',
    fg: './img/maps/images/home_island_fg.png',
    player: './img/characters/human1.png',
    npc: './img/characters/human2.png'
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

let player
let npc
let currentMap

let startTile = { x: 13, y: 19 }

let startPixel = {
    x: (startTile.x * tileSize * -1),
    y: (startTile.y * tileSize * -1)
}

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

    let playerSprite = new Sprite({
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

    player = new Player({
        sprite: playerSprite,
        currentTile: startTile,
        moveSpeed: walkSpeed
    })

    let npcSprite = new Sprite({
        position: {
            x: roundToTileSize(((canvas.width / 2) / ctxScale.x) - 16),
            y: roundToTileSize((canvas.height / 2) / ctxScale.y)
        },
        image: imagePaths.npc,
        offset: { x: 0, y: -4 },
        frames: {
            maxX: 3,
            maxY: 4,
            currX: 1,
            currY: 0,
        }
    })

    npc = new NPC({
        sprite: npcSprite,
        currentTile: startTile,
        moveSpeed: walkSpeed
    })

    currentMap.npcSprites.push(npcSprite)

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
        player.sprite.draw()
        npc.sprite.draw()
        currentMap.fgImage.draw()

        player.sprite.drawName()

        if (!battle.initiated) {
            currentMap.moveMap()

            player.sprite.moving = moveDir
        } else {
            playBattleTransition()
            player.sprite.moving = ''
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (e.shiftKey) {
        if (player.moveSpeed == runSpeed)
            player.moveSpeed = walkSpeed
        else
            player.moveSpeed = runSpeed
    }
    if (pressedKey.toLowerCase() != e.key.toLowerCase() && e.key != 'Shift') {
        pressedKey = e.key.toLowerCase()
    }
})

window.addEventListener('keyup', (e) => {
    if (pressedKey.toLowerCase() == e.key.toLowerCase() && e.key != 'Shift') {
        pressedKey = ''
        player.sprite.finishingMove = true
    }
})