// Canvas Vars
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side

// Sketch Vars
let classifier
let video

let modelURL = "model/v1/model.json"
let label
let confidence

let timer = 15
let tabOpened = false

let points = []

function preload() {
    classifier = ml5.imageClassifier(modelURL)
    label = "Model loading…"
}


// p5 Setup
function setup() {
    let canvas = createCanvas(canW,canH)
    canvas.parent(container)

    video = createCapture(VIDEO)
    video.hide()

    textSize(32)
    textAlign(CENTER, CENTER)
    fill(255)

    classifyVideo()
}

// p5 Draw
function draw() {
    background(0)
    image(video, 0, 0, canW, canW / 16 * 9)
    text(label, width/2, height-64)
    text(confidence, width/2, height-32)

    if (label == "Bottle") {
        kurzePause()
    } else if (label == "Lighter") {
        streamTab()
    } else if (label == "Pencil") {
        zeichne()
    } else {
        tabOpened = false
        clearPoints()
        timer = 15
    }
}

function classifyVideo() {
    classifier.classify(video, gotResult)
}

function gotResult(error, result) {
    if (error) {
        console.error(error)
        return
    }
    classifyVideo()

    label = result[0].label
    confidence = nf(result[0].confidence * 100, 0, 2) + "%"
}

function kurzePause() {
    tabOpened = false
    clearPoints()
    text(timer, width/2, height/2)
    tint(255, 50)
    if (frameCount % 30 == 0 && timer > 0) {
        timer--
    }
    if (timer == 0) {
        timer = ""
        text("PAUSE VORBEI", width/2, height/2)
        tint(255,255)
    }
}

function streamTab() {
    clearPoints()
    timer = 15
    if(!tabOpened) {
        window.open("https://www.youtube.com/watch?v=21X5lGlDOfg")
    }
    tabOpened = true
}

function zeichne() {
    tabOpened = false
    timer = 15
    background(0, 0)
    stroke(10)
    strokeWeight(10)

    beginShape(LINES)
    for (let i in points) {
        let singlePoint = points[i]
        curveVertex(singlePoint.x, singlePoint.y)
    }
    endShape()
}

function clearPoints() {
    while(points.length > 0) {
        points.pop()
    }
    noStroke()
}

function mouseDragged() {
    let singlePoint = {}
    singlePoint.x = mouseX
    singlePoint.y = mouseY

    points.push(singlePoint)
}







// The End, My Friend.