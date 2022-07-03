let canvasX
let canvasY
let backgroundColor
let walls
let cam

function setup() {
    canvasX = windowWidth
    canvasY = windowHeight * 0.85
    let myCanvas = createCanvas(canvasX + 1, canvasY + 1, WEBGL)
    myCanvas.parent("#canvas")
    backgroundColor = window.getComputedStyle(document.getElementById("canvas")).getPropertyValue('background-color')
    background(backgroundColor)

    walls = []
    for (let i = 0; i < 100; i++) {
        walls.push(new wall(random(100, 1000), 100, createVector(random(0, width), random(0, height), random(-100, -10000))))
    }
    
    cam = new masterCam(0, 0, (height/2) / tan(PI/6), 100, 0, -5000)
}

function draw() {
    background(backgroundColor)
    cam.update()
    translate(-width/2, -height/2, 0)

    walls.forEach(wall => wall.draw())

    cam.z -= 10
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
            //pos.z += 5
            pop()
        }
    }
}

class masterCam {
    constructor(x, y, z, centerX, centerY, centerZ) {
        this.x = x
        this.y = y
        this.z = z
        this.centerX = centerX
        this.centerY = centerY
        this.centerZ = centerZ
        this.update = function() {
            camera(this.x, this.y, this.z, this.centerX, this.centerY, this.centerZ, 0, 1, 0)
        }
    }
}