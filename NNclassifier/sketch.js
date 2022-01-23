let model;
let outcome;


function setup() {
  noCanvas();

  let options = {
    dataUrl: "data/driving_data_final.csv",
    inputs: ["age", "hour", "gender"],
    outputs: ["prediction"],
    task: "classification",
    debug: true,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(classify);
  predictButton.hide();

  trainButton = select("#train");

  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 30,
    };

    model.train(trainOptions, whileTraining, finishedTraining);
  });

  trainButton.position(0, 300);
}

function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  trainButton.hide();
}

function classify() {
  let alter = parseInt(select("#age").value());
  let stunden = parseInt(select("#hours").value());
  let geschlecht = parseInt(select("#gender").elt.value);

  let userInputs = {
    age: alter,
    hour: stunden,
    gender: geschlecht,
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    if (result[0].label == "no") {
      outcome = "nicht bestehen";
    } else {
      outcome = "bestehen!";
    }
    
    select("#result").html(
      "Die Person wird die Fahrprüfung wahrscheinlich " + outcome
    );
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}
