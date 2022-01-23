// Canvas Vars
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side


// Current Sketch Vars
let faceapi;
let video;
let detections;

// by default all options are set to true
const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

function setup() {
  let can = createCanvas(canW, canH);
  can.parent(container)

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
  faceapi = ml5.faceApi(video, detectionOptions, modelReady);
  textAlign(RIGHT);
}

let counter = 0

function draw() {
  if (detections) {
    if (counter > canH) {
      counter = 0
    }
    drawEyes(detections, counter)
    counter += 5
  } else {
    // how to reset if detection has been lost?
    counter = 0
  }
}


function modelReady() {
  console.log("ready!");
  // console.log(faceapi);
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  // console.log(result)
  detections = result;

  // background(220);
  background(255);
  image(video, 0, 0, width, height);
  if (detections) {
    if (detections.length > 0) {
      // console.log(detections)
      // drawBox(detections);
      // drawLandmarks(detections);
      // drawEyes(detections)
    }
  }
  faceapi.detect(gotResults);
}

function drawEyes(detections, counter) {
  let c = counter

  noStroke()

  if (c % 10 == 0) {
    blendMode(DIFFERENCE)
  } else {
    blendMode(OVERLAY)
  }

  for (let i = 0; i < detections.length; i++) {
    let leftEye = detections[i].parts.leftEye;
    let rightEye = detections[i].parts.rightEye;

    fill(0, 255, 0)
    ellipse(leftEye[1]._x, leftEye[1]._y, c+5, c+5)
    fill(255, 0, 0)
    ellipse(rightEye[1]._x, rightEye[1]._y, c+5, c+5)
  }
  blendMode(BLEND)
  // filter(GRAY)
}



function drawBox(detections) {
  for (let i = 0; i < detections.length; i += 1) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;

    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);
  }
}

function drawLandmarks(detections) {
  noFill();
  stroke(0, 255, 0);
  strokeWeight(2);

  for (let i = 0; i < detections.length; i += 1) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;
    const jawOutline = detections[i].parts.jawOutline;

    drawPart(mouth, true);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEye, true);
    drawPart(rightEyeBrow, false);
    drawPart(jawOutline, false);
  }
}

function drawPart(feature, closed) {
  beginShape();
  for (let i = 0; i < feature.length; i += 1) {
    const x = feature[i]._x;
    const y = feature[i]._y;
    vertex(x, y);
  }

  if (closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}





// My only friend, the end.