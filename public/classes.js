class Sprite {
    constructor({ position, image, frames }) {
        this.position = position
        this.image = image
        this.frames = frames

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
    }

}