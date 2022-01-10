

let facemesh;
let video;
let predictions = [];

/////////////////////////////////////////////////////////////// P5 SETUP
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  textSize(15)
  textAlign(CENTER, CENTER)
}

/////////////////////////////////////////////////////////////// P5 DRAW
function draw() {
  background(0)
  image(video, 0, 0, width, height);
  filter(GRAY);

  // bgnose()

  colorMode(RGB, 255)

  // We call function to draw all keypoints
  raiseBrow()
  drawSilhouette()
  // drawKeypoints()
  // drawRays()
  // drawLeftEye()
  mouthRays()

  noStroke()
  fill(255)
  text("raise right eyebrow to change bg", width/2, 15)
  text("open mouth for some rays", width/2, 33)

  stroke(255)
  strokeWeight(1)
  noFill()
  ellipse(width/2, height/2, height/2.5, height/2.5)
}


/////////////////////////////////////////////////////////////// FUNCTIONS

function modelReady() {
  console.log("Model ready!");
}

function raiseBrow() {
  for (let i = 0; i < predictions.length; i += 1) {
    const browPtLeft = predictions[i].annotations.leftEyebrowUpper[3]
    const eyePtLeft = predictions[i].annotations.leftEyeUpper0[3]

    let dleft = dist(browPtLeft[0], browPtLeft[1], eyePtLeft[0], eyePtLeft[1])
    let g = map(dleft, 15, 35, 0, 255)

    fill(0, g, 0)
    noStroke()
    // blendMode(MULTIPLY)
    rect(0, 0, width, height)

    fill(255, 0, 0)
    ellipse(browPtLeft[0], browPtLeft[1], 10, 10)
    ellipse(eyePtLeft[0], eyePtLeft[1], 10, 10)
  }
}

function bgnose() {
  for (let i = 0; i < predictions.length; i++) {
    const nosetip = predictions[i].annotations.noseTip
    let h = map(nosetip[0][0], 0, width, 0, 100)
    let s = map(nosetip[0][1], 0, height, 0, 100)
    colorMode(HSB, 100)
    background(h, 100, s, 50)
  }
}

function mouthRays() {
  for (let i = 0; i < predictions.length; i++) {
    const lipsLower = predictions[i].annotations.lipsLowerInner
    const lipsUpper = predictions[i].annotations.lipsUpperInner
    const lips = lipsLower.concat(lipsUpper)
    const c = {
      x: lipsLower[10][0] - (lipsLower[10][0]-lipsLower[0][0])/2,
      y: lipsLower[5][1] - (lipsLower[5][1]-lipsUpper[5][1])/2
    }

    let opening = dist(lipsLower[5][0], lipsLower[5][1], lipsUpper[5][0], lipsUpper[5][1])
    if (opening > 10) {
      for (let i in lips) {
        let v = createVector(lips[i][0]-c.x, lips[i][1]-c.y)
        stroke(255)
        strokeWeight(1)
        line(c.x, c.y, c.x + v.x * opening, c.y + v.y * opening)
      }
    }

    // ellipse(c.x, c.y, 1, 1)
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(0, 255, 0);
      noStroke()
      ellipse(x, y, 1, 1);
    }
  }
}

function drawSilhouette() {
  for (let i = 0; i < predictions.length; i += 1) {
    const silhouette = predictions[i].annotations.silhouette

    noFill()
    stroke(0, 0, 0)
    strokeWeight(5)
    beginShape(POINTS)
    for (let i in silhouette) {
        let singlePoint = silhouette[i]
        curveVertex(singlePoint[0], singlePoint[1])
    }
    endShape()
  }
}

function drawLeftEye() {
  for (let i = 0; i < predictions.length; i += 1) {
    const upper = predictions[i].annotations.leftEyeUpper0
    const lower = predictions[i].annotations.leftEyeLower0


    noFill()
    stroke(255, 0, 0)
    strokeWeight(5)
    beginShape(POINTS)
    for (let i in upper) {
        let singlePoint = upper[i]
        curveVertex(singlePoint[0], singlePoint[1])
    }
    endShape()
    beginShape(POINTS)
    for (let i in lower) {
        let singlePoint = lower[i]
        curveVertex(singlePoint[0], singlePoint[1])
    }
    endShape()
  }
}

function drawRays() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      noFill()
      stroke(0, 255, 0);
      strokeWeight(1)
      line(width/2, height/2, x, y)
    }
  }
}