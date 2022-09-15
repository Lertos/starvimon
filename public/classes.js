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
        
        //Update the elapsed frames
        if (this.frames.maxX > 1 || this.frames.maxY > 1)
            this.elapsedFrames++

        if (this.elapsedFrames % 8 == 0) {
            if (this.frames.currX < this.frames.maxX - 1)
                this.frames.currX++
            else
                this.frames.currX = 0
        }
    }

}