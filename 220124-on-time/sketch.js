let table
function preload() {
    table = loadTable("data/Toni-4-20210103_20210109.csv", "header", "csv")
}
function prepareTable(table) {
  let rows = table.getRows()
  for (let i = 0; i < rows.length; i++) {
    let target = rows[i].getNum("soll_an_von")
    let actual = rows[i].getNum("ist_an_von")
    if (actual > target){
      table.setString(i, "is_delayed", "true")
    } else {
      table.setString(i, "is_delayed", "false")
    }
  }
  saveTable(table, "data_toni_neu.csv")
}


let model;
let outcome;

function setup() {
  noCanvas();
  // prepareTable(table)

  let options = {
    dataUrl: "data/data_toni_neu.csv",
    inputs: ["soll_an_von", "ist_an_von", "delay"], //"halt_kurz_von1", 
    outputs: ["is_delayed"],
    task: "classification",
    debug: true,
    // learningRate: 0.2,
    // hiddenUnits: 16,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(classify);
  predictButton.hide();

  trainButton = select("#train");

  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 30,
      // batchSize: 12
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
  let currentTime = parseInt(select("#currentTime").value());
  // let isTime = parseInt(select("#ist_an_von").value());
  // let comingFrom = parseInt(select("#halt_kurz_von1").elt.value);

  let userInputs = {
    soll_an_von: currentTime,
    // this is obviously useless and stupid
    // but NN requires all inputs...
    ist_an_von: 1,
    delay: 1
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    if (result[0].label == "true") {
      outcome = "nicht on-time";
    } else {
      outcome = "on-time!";
    }
    
    select("#result").html(
      "Der 4er ist wahrscheinlich " + outcome
    );
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}
