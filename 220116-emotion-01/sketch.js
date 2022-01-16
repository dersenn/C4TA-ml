// Canvas Vars
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side


// Current Sketch Vars
let mobileNet
let classifier

let video

let classes = ["Happy", "Surprised", "Neutral"]
let buttons = ["buttonHappy", "buttonSurprised", "buttonNeutral"]

let faceapi
let detections = []


// p5 Setup
function setup() {
  let canvas = createCanvas(canW,canH)
  canvas.parent(container)

  video = createCapture(VIDEO)
  video.size(width, height)
  video.hide()

  const options = {numLabels: 3}

  mobileNet = ml5.featureExtractor("MobileNet", modelReady)
  classifier = mobileNet.classification(video, options)

  initializeButtons()

  const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
  };
  // Initialize the magicFeature
  faceapi = ml5.faceApi(video, detectionOptions, modelLoaded);


}


function draw() {
  image(video, 0, 0)
  // ellipse(canW,0,10,10)
  if(detections.length > 0) {
    drawBox()
  }
}


function initializeButtons() {
  for (let i = 0; i < classes.length; i++) {
    let className = classes[i].toString()
    buttons[i] = select("#" + className)
    buttons[i].mousePressed(function() {
      classifier.addImage(className)
      let span = document.getElementById(className + "Images")
      let numImages = parseInt(span.innerHTML)
      numImages++
      span.innerHTML = numImages
    })
  }

  train = select("#Train")
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if(lossValue) {
        loss = lossValue
        select("#loss").html(`Loss: ${loss}`)
      } else {
        select("#loss").html(`Finished, Final loss: ${loss}`)
      }
    })
  })

  predict = select("#Predict")
  predict.mousePressed(classify)

  saveModel = select("#saveModel")
  saveModel.mousePressed(function() {
    classifier.save()
  })

  loadModel = select("#loadModel")
  loadModel.mousePressed(function() {
    select("#status").html("Loaded custom Model")
  })

  loadModel.changed(function() {
    classifier.load(loadModel.elt.files)
  })
}


function classify() {
  classifier.classify(gotResult)
}

function gotResult(error, result) {
  if (error) {
    console.error(error)
  }
  if(result){
    select("#result").html(result[0].label)
    select("#confidence").html(`${result[0].confidence.toFixed(2) * 100}%`)
    classify()
  }
}

function modelReady() {
  console.log("model loaded")
}


// When the model is loaded
function modelLoaded() {
  console.log("FaceApi Loaded")

  // Make some sparkles
  faceapi.detect(detectFaces);
}

function detectFaces(error, result) {
  if (error) {
    console.error(error)
  }
  detections = result
  faceapi.detect(detectFaces)
}

function drawBox(detections) {
  for (let i = 0; i < detections.length; i++) {
    let faceBox = detections[i].alignedRect
    let x = faceBox._box._x
    let y = faceBox._box._y
    let boxW = faceBox._box._width
    let boxH = faceBox._box._height

    noFill()
    strokeWeight(4)
    stroke(0,255,0)
    rect(x, y, boxW, boxH)
  }
}


// My only friend, the end.