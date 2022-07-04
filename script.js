let canvasX
let canvasY
let backgroundColor
let floors
let walls
let cam
let leftClicked = false
let player

let playerMaxSpeed = [20, 200, 20]

function setup() {
    canvasX = windowWidth
    canvasY = windowHeight * 0.85
    let myCanvas = createCanvas(canvasX, canvasY, WEBGL)
    myCanvas.parent("#canvas")
    backgroundColor = window.getComputedStyle(document.getElementById("canvas")).getPropertyValue('background-color')
    background(backgroundColor)

    player = new body(height / 8, width / 20, ...Array(4), playerMaxSpeed)
    floors = []
    floors.push(new floor(1000, 10000, createVector(0, player.height, 0))) //creates the ground
    floors.push(new floor(100, 1000, createVector(0, -300, -1000)))
    walls = []
    // for (let i = 0; i < 100; i++) {
    //     walls.push(new wall(random(100, 1000), 100, createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, -10000))))
    // }
    
    cam = createCamera()
}

function draw() {
    background(backgroundColor)
    floors.forEach(shape => {
        shape.draw()
    })
    walls.forEach(shape => {
        shape.draw()
    })

    player.draw()

    handleKeysPressed()

}

function handleKeysPressed() {

    // Handles xSpeed
    if (keyIsDown(68) || keyIsDown(39)) {       // Pressed "d" or "right arrow key", so move right
        player.xSpeed++
        if (player.xSpeed < 0) {
            player.xSpeed++
        }
    } else if (keyIsDown(65) || keyIsDown(37)) {// Pressed "a" or "left arrow key", so move left
        player.xSpeed--
        if (player.xSpeed > 0) {
            player.xSpeed--
        }
    } else {
        player.xSpeed -= Math.sign(player.xSpeed)
    }
    if (Math.abs(player.xSpeed) > player.maxSpeed[0]) { // Caps the xSpeed
        player.xSpeed = player.maxSpeed[0] * Math.sign(player.xSpeed)
    }

    // Handles zSpeed
    if (keyIsDown(87) || keyIsDown(38)) {       // Pressed "w" or "up arrow key", so move forward
        player.zSpeed--
        if (player.zSpeed > 0) {
            player.zSpeed--
        }
    } else if (keyIsDown(83) || keyIsDown(40)) {// Pressed "s" or "down arrow key", so move backward
        player.zSpeed++
        if (player.zSpeed < 0) {
            player.zSpeed++
        }
    } else {
        player.zSpeed -= Math.sign(player.zSpeed)
    }
    if (Math.abs(player.zSpeed) > player.maxSpeed[2]) { // Caps the zSpeed
        player.zSpeed = player.maxSpeed[2] * Math.sign(player.zSpeed)
    }

    // Handles ySpeed
    if (keyIsDown(32) && player.isGrounded) {
        player.ySpeed = -25
        player.isGrounded = false
    } else if (!player.isGrounded) {
        player.ySpeed++
    }
    if (Math.abs(player.ySpeed) > player.maxSpeed[1]) { // Caps the zSpeed
        player.ySpeed = player.maxSpeed[1] * Math.sign(player.ySpeed)
    }

    player.checkCollision()

    cam.move(player.xSpeed, player.ySpeed, player.zSpeed)

    if (leftClicked) {  // The mouse's left click is being held, so rotate the camera
        let percentHorizRotation = (pmouseX - mouseX) / (width / 2)
        cam.pan(radians(90 * percentHorizRotation))
    }

}

function mousePressed(event) {
    if (event.button == 0) { // Left click
        leftClicked = true
    }
}

function mouseReleased(event) {
    if (event.button == 0) { // Left click
        leftClicked = false
    }
}

class wall {
    constructor(width, height, pos) {
        this.width = width
        this.height = height
        this.pos = pos
        this.draw = function() {
            push()
            translate(pos)
            rotateY(radians(90))
            plane(this.width, this.height)
            pop()
        }
    }
}

class floor {
    constructor(width, height, pos) {
        this.width = width
        this.height = height
        this.pos = pos
        this.draw = function() {
            push()
            translate(pos)
            rotateX(radians(90))
            plane(this.width, this.height)
            pop()
        }
    }
}

class body {
    constructor(height, width, xSpeed = 0, zSpeed = 0, ySpeed = 0, isGrounded = true, maxSpeed = [10, 100, 10]) {
        this.height = height
        this.width = width
        this.xSpeed = xSpeed
        this.zSpeed = zSpeed
        this.ySpeed = ySpeed
        this.isGrounded = isGrounded
        this.maxSpeed = maxSpeed
        this.draw = function() {
            push()
            pop()
        }
        this.checkCollision = function() {
            let touchingGround = false
            floors.forEach(shape => {

                let nextX = cam.eyeX + this.xSpeed
                let nextY = cam.eyeY + this.ySpeed
                let nextZ = cam.eyeZ + this.zSpeed

                console.log(nextY)

                let withinX = shape.pos.x - shape.width / 2 <= nextX && shape.pos.x + shape.width / 2 >= nextX
                let withinY = shape.pos.y >= nextY && shape.pos.y <= nextY + this.height
                let withinZ = shape.pos.z - shape.height / 2 <= nextZ && shape.pos.z + shape.height / 2 >= nextZ

                if (withinX && withinY && withinZ) { // Checks if the player has collided with a floor
                    if (shape.pos.y - cam.eyeY > this.height / 2) {
                        this.ySpeed = shape.pos.y - cam.eyeY - this.height
                    } else {
                        this.ySpeed = shape.pos.y - cam.eyeY + this.height / 10
                    }
                    touchingGround = true
                }
            })
            this.isGrounded = touchingGround
        }
    }
}