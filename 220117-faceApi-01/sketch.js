// Canvas Vars
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side


// Current Sketch Vars
let modelRNN;
let previous_pen = "down"
let x, y;
let strokePath;

let drawing;
let clicked = false;
let resetClicked = false;


let buttons = ["b1", "b2", "b3", "b4", "b5"]
let drawingArray = []

let totalScore = 0;

function setup() {
  cvs = createCanvas(canW, canH);
  cvs.parent(container)
  // console.log(models)
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Helvetica");
  textSize(32);
  text("Errate die Skizze", width / 2, height / 2)
  text("Drücke S zum Starten", width / 2, height / 2 + 100)

  for (let i = 0; i < buttons.length; i++) {
    buttons[i] = select("#" + buttons[i].toString());
  }

}

function modelReady() {
  select("#status").html("modelRNN wurde geladen")
  startDrawing();
}

function keyPressed() {
  if (key == "s" | key == "S") {
    if (!clicked) {
      totalScore = 0;
      select("#status").html("modelRNN am Laden")
      drawing = models[Math.floor(Math.random() * models.length)];
      modelRNN = ml5.sketchRNN(drawing, modelReady)
      clicked = true;
    }
  }
  if (key == "r" | key == "R") {
    drawing = models[Math.floor(Math.random() * models.length)];
    modelRNN = ml5.sketchRNN(drawing, modelReady)
    resetClicked = true;
  }
}

// Reset the drawing
function startDrawing() {
  resetButtons();
  background(255);
  strokeWeight(0)
  fill(0)
  text("Total Score", width - 200, 20);
  text(totalScore, width - 50, 20)
  // Start in the middle
  x = width / 2;
  y = height / 2;

  // Generate the first stroke path
  modelRNN.generate(gotStroke);
}

function draw() {
  // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen == 'down') {
      stroke(0);
      strokeWeight(3.0);
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state actually refers to the next stroke
    previous_pen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== 'end') {
      strokePath = null;
      modelRNN.generate(gotStroke);
    }
  }

  if (totalScore > 20) {
    clear();
    strokeWeight(0);
    fill(50, 180, 20);
    text("YOU WON!", width / 2, height / 2)
    text(" Drücke S zum Neustart", width / 2, height / 2 + 100);
    clicked = false;
  }
}

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}


function resetButtons() {

  drawingArray = []

  for (let i = 0; i < buttons.length; i++) {
    drawingArray.push(models[Math.floor(Math.random() * models.length)])
  }

  drawingArray.splice(Math.floor(Math.random() * drawingArray.length), 1, drawing)

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].html(drawingArray[i].toString());

    buttons[i].mousePressed(function () {

      if (buttons[i].html() == drawing) {
        drawing = models[Math.floor(Math.random() * models.length)]
        modelRNN = ml5.sketchRNN(drawing, modelReady);
        totalScore += 10;
      } else {
        strokeWeight(0);
        text("Game Over", width / 2, height / 2 - 100)
        text("Drücke R zum Restarten", width / 2, height / 2)
        fill(50, 180, 20);
        text(`Die Antwort war : ${drawing}`, width / 2, height / 2 + 100);
      }
    })
  }
}






// My only friend, the end.