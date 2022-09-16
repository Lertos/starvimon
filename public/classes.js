class Sprite {

    constructor({ position, image, frames }) {
        this.position = position
        this.image = image
        this.frames = frames

        this.elapsedFrames = 0
        this.idleFrame = frames.currX

        this.image.onload = () => {
            this.width = this.image.width / this.frames.maxX
            this.height = this.image.height / this.frames.maxY
        }

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
            this.position.x, 
            this.position.y, 
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
        ctx.font = 'bold 6px arial';
        
        let metrics = ctx.measureText(text);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.strokeText(text, this.position.x - metrics.width / 2 + this.width / 2, this.position.y);
        
        ctx.fillStyle = 'white';
        ctx.fillText(text, this.position.x - metrics.width / 2 + this.width / 2, this.position.y);
    }

    updateAnimation(isFinishing) {
        if (this.frames.maxX > 1 || this.frames.maxY > 1)
            this.elapsedFrames++

        if (this.elapsedFrames % 8 == 0) {
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