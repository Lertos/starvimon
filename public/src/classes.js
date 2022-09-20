const SpriteType = {
    Player: 'player',
    NPC: 'npc',
    Other: 'other'
  }


class Sprite {

    constructor({ type, position, image, offset, frames }) {
        this.type = type
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

    updateAnimation(isFinishing) {
        if (this.frames.maxX > 1 || this.frames.maxY > 1)
            this.elapsedFrames++

        if (this.elapsedFrames % 6 == 0) {
            this.frames.currY = this.spriteRowForDirection.indexOf(this.lastDirection)

            if (this.frames.currX < this.frames.maxX - 1)
                this.frames.currX++
            else
                this.frames.currX = 0

            //Make sure when the animation is done, the sprite returns to the idle frame
            if (isFinishing) {
                this.elapsedFrames =  0
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
        this.npcs = []

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

            let possibleTile = { x: player.currentTile.x - x , y: player.currentTile.y - y }

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
        if ((xMovement != 0 && xMovement <= player.moveSpeed) || (yMovement != 0 && yMovement <= player.moveSpeed)) {
            this.movePositionOfMapLayers(xMovement * x, yMovement * y, this.npcs)
            xMovement = destinationTile.x
            yMovement = destinationTile.y

            this.setPositionOfMapLayers(xMovement, yMovement, this.movingSprites)
            this.onDestinationArrival(x, y)
        } else {
            xMovement = (player.moveSpeed * x)
            yMovement = (player.moveSpeed * y)
            
            this.movePositionOfMapLayers(xMovement, yMovement, this.movingSprites)
            this.movePositionOfMapLayers(xMovement, yMovement, this.npcs)
        }
    }

    onDestinationArrival(x, y) {
        player.currentTile.x -= x
        player.currentTile.y -= y

        moveDir = ''

        if (this.isTileType(player.currentTile, this.mapBattleZones)) {
            //TODO: This should come from a map default such as "battle rate"
            if (Math.random() < 0.25) {
                battle.initiated = true
                console.log('battle')
            }
        }
    }

    setPositionOfMapLayers(x, y, list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] instanceof NPC) {
                list[i].sprite.position.x = x
                list[i].sprite.position.y = y
            } else {
                list[i].position.x = x
                list[i].position.y = y
            }
        }
    }

    movePositionOfMapLayers(x, y, list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] instanceof NPC) {
                list[i].sprite.position.x += x
                list[i].sprite.position.y += y
            } else {
                list[i].position.x += x
                list[i].position.y += y
            }
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

class Player {

    constructor({ sprite, currentTile, moveSpeed }) {
        this.sprite = sprite
        this.currentTile = currentTile
        this.moveSpeed = moveSpeed
    }

}

class NPC {

    constructor({ sprite, positionChanges, moveSpeed }) {
        this.sprite = sprite
        this.positionChanges = positionChanges
        this.moveSpeed = moveSpeed
    }

    moveToDestination() {
        if (this.getNextMovement() == -1)
            return

        let positionChange = this.positionChanges[0]

        let x = Math.sign(positionChange.x)
        let y = Math.sign(positionChange.y)

        this.sprite.moving = this.getMoveDirection(x, y)

        this.moveSprite(positionChange, x, y)
    }

    moveSprite(positionChange, x, y) {
        if (positionChange.x != 0) {
            if (Math.abs(positionChange.x) <= this.moveSpeed) {
                this.sprite.position.x += positionChange.x

                if (x > 0)
                    this.positionChanges[0].x -= Math.abs(positionChange.x)
                else    
                    this.positionChanges[0].x += Math.abs(positionChange.x)
                
                this.positionChanges.shift()
            } else {
                if (x > 0) {
                    this.sprite.position.x += this.moveSpeed
                    this.positionChanges[0].x -= this.moveSpeed
                } else {
                    this.sprite.position.x -= this.moveSpeed
                    this.positionChanges[0].x += this.moveSpeed
                }
            }
        } else if (positionChange.y != 0) {
            if (Math.abs(positionChange.y) <= this.moveSpeed) {
                this.sprite.position.y += positionChange.y

                if (y > 0)
                    this.positionChanges[0].y -= Math.abs(positionChange.y)
                else    
                    this.positionChanges[0].y += Math.abs(positionChange.y)
                
                this.positionChanges.shift()
            } else {
                if (y > 0) {
                    this.sprite.position.y += this.moveSpeed
                    this.positionChanges[0].y -= this.moveSpeed
                } else {
                    this.sprite.position.y -= this.moveSpeed
                    this.positionChanges[0].y += this.moveSpeed
                }
            }
        }
    }

    getNextMovement() {
        if (this.positionChanges.length == 0) {
            this.sprite.moving = ''
            this.sprite.finishingMove = true
            return -1
        }

        if (this.positionChanges[0].x == 0 && this.positionChanges[0].y == 0) {
            this.positionChanges.shift()

            if (this.positionChanges.length == 0) {
                this.sprite.moving = ''
                this.sprite.finishingMove = true
                return -1
            }
        }
    }

    getMoveDirection(x, y) {
        if (x > 0)
            return 'right'
        else if (x < 0)
            return 'left'
        else if (y > 0)
            return 'down'
        else if (y < 0)
            return 'up'
    }
}