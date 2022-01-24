
// Trainiere regression model um Zwischentönen für mehrere Gitarrensaiten zu erzeugen


const strings = [];
let envelope, wave;
let state = "collection";
let notes = {
  E: 330,
  G: 196,
  A: 110,
};
let targetLabel = "E";

const modelInfo = {
  model: "model/model.json",
  metadata: "model/model_meta.json",
  weights: "model/model.weights.bin",
};

let frequency = 0;

let dataIsLoaded = false;

function setup() {
  createCanvas(600, 600);
  background(245);

  for (let i = 50; i < height; i += 100) {
    strings.push(new GuitarString(1, new createVector(width / 2, i)));
  }

  // eine Schallwelle und ein Hüllkurve
  envelope = new p5.Envelope();
  envelope.setADSR(0.05, 0.1, 0.5, 1);
  envelope.setRange(1.2, 0);

  wave = new p5.Oscillator();
  wave.setType("sine");
  wave.start();
  wave.freq(440);
  wave.amp(envelope);

  let options = {
    inputs: ["x", "y"],
    outputs: ["frequency"],
    task: "regression",
    debug: "true",
    learningRate: 0.1
  };

  model = ml5.neuralNetwork(options);
  textAlign(CENTER, CENTER);
  textSize(32);

  setButtons();

  for (let string of strings) {
    strokeWeight(1);
    string.update();
    string.draw();
  }
}

function modelLoaded() {
  console.log("model loaded");
  state = "prediction";
}

function draw() {
  if (state == "prediction") {
    background(245, 160);

    for (let i = 0; i < strings.length; i++) {
      //somit kann man "strokeWeight" unterschiedich setzen
      stroke(0)
      strokeWeight(10 / (i + 1));
      strings[i].update();
      strings[i].draw();
      //schaut euch dist() auf p5 Referenz Website
      distToMid = dist(mouseX, mouseY, strings[i].mid.x, strings[i].mid.y);
      if (distToMid < 50) {
        fill(0);
        ellipse(strings[i].mid.x, strings[i].mid.y, 20);
        fill(155);
        text(str(frequency).slice(0, 6), mouseX, mouseY);
      }
    }
    paintData()
  }
}

function setButtons() {
  aButton = createButton("Train #A");
  eButton = createButton("Train #E");
  gButton = createButton("Train #G");
  aButton.position(620, 20);
  eButton.position(620, 60);
  gButton.position(620, 100);

  saveDataButton = createButton("Save Data");
  loadDataButton = createButton("Load Data");
  saveDataButton.position(620, 500);
  loadDataButton.position(720, 500);
  saveModelButton = createButton("Save Model");
  loadModelButton = createButton("Load Model");
  saveModelButton.position(620, 540);
  loadModelButton.position(720, 540);

  trainButton = createButton("Train");
  trainButton.position(620, 580);

  aButton.mousePressed(function () {
    textStyle(ITALIC);
    targetLabel = "A";
  });

  eButton.mousePressed(function () {
    textStyle(BOLD);
    targetLabel = "E";
  });

  gButton.mousePressed(function () {
    textStyle(NORMAL);
    targetLabel = "G";
  });

  trainButton.mousePressed(function () {
    console.log("starting training");

    model.normalizeData();

    // probiert die Epochs zu ändern und schaut was passiert!
    let options = {
      epochs: 50,
    };
    model.train(options, whileTraining, finishedTraining);
  });

  saveDataButton.mousePressed(function () {
    model.saveData("strings");
  });

  saveModelButton.mousePressed(function () {
    model.save();
  });

  loadDataButton.mousePressed(function () {
    model.loadData("strings.json", dataLoaded);
  });

  loadModelButton.mousePressed(function () {
    model.load(modelInfo);
    state = "prediction";
  });
}

function dataLoaded() {
  console.log("Data Loaded");
  dataIsLoaded = true;
}

function paintData() {
  if (dataIsLoaded) {
    let data = model.data.data.raw;
    for (let i = 0; i < data.length; i++) {
      let inputs = data[i].xs;
      let target = data[i].ys;
      // console.log(inputs)
      // console.log(target)
      noStroke()
      fill(0,255,0)
      ellipse(inputs.x,inputs.y,10,10)
    }
  }
}

function mousePressed() {
  //falls es einen AudioWorklet Fehler gibt, kann diese Zeile den Zugang zum Web Audio API ermöglichen
  getAudioContext().resume();

  let inputs = {
    x: mouseX,
    y: mouseY,
  };

  if (state == "collection") {
    let targetFrequency = notes[targetLabel];
    let target = { frequency: targetFrequency };

    model.addData(inputs, target);
    wave.freq(targetFrequency);
    envelope.play();

    text(targetLabel, mouseX, mouseY);

  } else if (state == "prediction") {
    model.predict(inputs, gotResults);
  }
}

function whileTraining(epoch, loss) {
  console.log(`epoch: ${epoch}, loss: ${loss}`);
}

function finishedTraining() {
  console.log("finished training.");
  clear();
  state = "prediction";
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  frequency = results[0].value;

  for (let string of strings) {
    distToMid = dist(mouseX, mouseY, string.mid.x, string.mid.y);

    if (distToMid < 50) {
      //somit kann man die einzelnen Saite ins Schwanken bringen
      string.setVal(floor(frequency) / 100);
      string.pluck();
    }
  }

  wave.freq(frequency);
  envelope.play();
}
