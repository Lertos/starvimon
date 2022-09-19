class Sprite {

    constructor({ position, image, offset, frames }) {
        this.position = position
        this.image = image
        this.frames = frames
        this.offset = offset

        this.elapsedFrames = 0
        this.idleFrame = frames.currX

        this.width = this.image.width / this.frames.maxX
        this.height = this.image.height / this.frames.maxY

        this.spriteRowForDirection = ['down', 'left', 'right', 'up']

        this.moving = ''
        this.lastDirection = ''
        this.finishingMove = false
    }

    draw() {
        ctx.drawImage(
            this.image, 
            this.width * this.frames.currX, //Crop X
            this.height * this.frames.currY, //Crop Y
            this.width, //Crop Width
            this.height, //Crop Height
            this.position.x + this.offset.x, 
            this.position.y + this.offset.y, 
            this.width,
            this.height
        )

        if (this.moving != '') {
            if (this.lastDirection != this.moving)
                this.lastDirection = this.moving
        }
        
        if (this.moving == '') {
            if (this.finishingMove) {
                this.updateAnimation(true)
            }
            return
        }

        this.updateAnimation(false)
    }

    drawName() {
        let text = 'LERTOS'
        ctx.font = 'bold 6px arial'
        
        let metrics = ctx.measureText(text)

        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1.5
        ctx.strokeText(
            text, 
            this.position.x + this.offset.x - metrics.width / 2 + this.width / 2, 
            this.position.y + this.offset.y
        )
        
        ctx.fillStyle = 'white'
        ctx.fillText(
            text, 
            this.position.x + this.offset.x - metrics.width / 2 + this.width / 2, 
            this.position.y + this.offset.y
        )
    }

    updateAnimation(isFinishing) {
        if (this.frames.maxX > 1 || this.frames.maxY > 1)
            this.elapsedFrames++

        if (this.elapsedFrames % 6 == 0) {
            this.frames.currY = this.spriteRowForDirection.indexOf(this.lastDirection)

            if (this.frames.currX < this.frames.maxX - 1)
                this.frames.currX++
            else
                this.frames.currX = 0

            if (isFinishing) {
                this.frames.currX = this.idleFrame
                this.isFinishing = false
            }
        }
    }

}

class InstanceMap {

    constructor({ id, bgImage, fgImage, mapSize, collisions, battleZones }) {
        this.id = id
        this.mapSize = mapSize
        this.collisions = collisions
        this.battleZones = battleZones

        this.bgImage = bgImage
        this.fgImage = fgImage
    
        //Add any object that should be moved along with the map
        this.movingSprites = [bgImage, fgImage]

        this.mapCollisions = []

        for (let i=0; i<this.collisions.length; i+=this.mapSize.x)
            this.mapCollisions.push(this.collisions.slice(i, this.mapSize.x + i))

        this.mapBattleZones = []

        for (let i=0; i<this.battleZones.length; i+=this.mapSize.x)
            this.mapBattleZones.push(this.battleZones.slice(i, this.mapSize.x + i))

    }
    
    moveMap() {
        let x = 0
        let y = 0
        let newMovement = true

        //Track if this is a new movement or not
        if (moveDir != '')
            newMovement = false

            this.setNewDirection()

        let directionValues = this.getDirectionValue()

        x = directionValues.x
        y = directionValues.y

        //There is movement taking place
        if (x != 0 || y != 0) {
            if (newMovement)
                startingTile = { x: this.bgImage.position.x, y: this.bgImage.position.y }

            let possibleTile = { x: currentTile.x - x , y: currentTile.y - y }

            //Handle collision detection
            if (this.isTileType(possibleTile, this.mapCollisions)) {
                moveDir = ''
                return
            }

            //Tile must be walkable. Proceed with the movement calculation
            this.handleFrameMovement(x, y)
        }
    }

    handleFrameMovement(x, y) {
        destinationTile = { x: startingTile.x + (tileSize * x), y: startingTile.y + (tileSize * y) }

        let xMovement = Math.abs(destinationTile.x - this.bgImage.position.x)
        let yMovement = Math.abs(destinationTile.y - this.bgImage.position.y)

        //If the distance to travel is less then the movement speed, set them to the destination
        if ((xMovement != 0 && xMovement <= moveSpeed) || (yMovement != 0 && yMovement <= moveSpeed)) {
            xMovement = destinationTile.x
            yMovement = destinationTile.y

            this.onDestinationArrival(x, y)
        } else {
            xMovement = this.bgImage.position.x + (moveSpeed * x)
            yMovement = this.bgImage.position.y + (moveSpeed * y)
        }

        this.setPositionOfMapLayers(xMovement, yMovement)
    }

    onDestinationArrival(x, y) {
        currentTile.x -= x
        currentTile.y -= y

        moveDir = ''

        if (this.isTileType(currentTile, this.mapBattleZones)) {
            //TODO: This should come from a map default such as "battle rate"
            if (Math.random() < 0.25) {
                battle.initiated = true
                console.log('battle')
            }
        }
    }

    setPositionOfMapLayers(x, y) {
        for (let i = 0; i < this.movingSprites.length; i++) {
            this.movingSprites[i].position.x = x
            this.movingSprites[i].position.y = y
        }
    }

    isTileType(tile, tileType) {
        var tileValue = tileType[tile.y][tile.x]
    
        if (tileValue == 0)
            return false
        return true
    }

    setNewDirection() {
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
    
    getDirectionValue() {
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

}