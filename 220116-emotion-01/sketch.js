// Canvas Vars
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side


// Current Sketch Vars
let mobileNet;
let classifier;

let video;

let classes = [ "Happy", "Surprised", "Neutral"]
let buttons = ["buttonHappy", "buttonSurprised", "buttonNeutral"]
let removebuttons = ["removebuttonHappy", "removebuttonSurprised", "removebuttonNeutral"]

let happyImages = []
let surprisedImages = []
let neutralImages = []

let faceapi;

let detections = []

function setup() 
{
  can = createCanvas(640, 480);
    can.parent(container)

    video = createCapture(VIDEO)
    video.size(width, height)
    video.hide()

    const options = {numLabels : 3}
    mobileNet = ml5.featureExtractor("MobileNet", modelReady);
    classifier = mobileNet.classification(video, options)
    
    const detectionOptions = {
        withLandmarks: true,
        withDescriptors: false,
      };


   // Initialize the magicFeature
    faceapi = ml5.faceApi(video,detectionOptions, modelLoaded);
    
    initalizeButtons()
}



function draw()
{
 image(video, 0, 0);

 if(detections.length > 0){
     drawBox(detections)
 }
}

function modelReady(){
   select("#status").html("Model Loaded")
}

 
  // When the model is loaded
  function modelLoaded() {
    select("#status").html("FaceApi Model Loaded")
  
    // Make some sparkles
    faceapi.detect(detectFaces);
  }
  

  

function initalizeButtons() {
  
    // intialize class buttons
    for(let i = 0; i< classes.length; i++){
        let className = classes[i].toString()
        buttons[i] = select("#" + className);
        buttons[i].mousePressed( function() {
          //  classifier.addImage(className)
            var img = can.elt.toDataURL("image/jpeg", 1.0)
            console.log(img);
            if ( className == "Happy") {

                happyImages.push(img);
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages++
                span.innerHTML = numImages;
                
            } else if ( className == "Surprised") {
                surprisedImages.push(img);
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages++
                span.innerHTML = numImages;

            }else {

                neutralImages.push(img);
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages++
                span.innerHTML = numImages;


            }




           

        })
    }

    //initalize remove buttons
    
    for(let i = 0; i < classes.length; i++){
        let className = classes[i].toString()
        removebuttons[i] = select("#remove" + className + "Images");
        removebuttons[i].mousePressed( function() {
           
            if (className == "Happy"){
                happyImages.splice(0, happyImages.length)
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages = 0
                span.innerHTML = numImages;

            }else if ( className == "Surprised"){
                surprisedImages.splice(0, surprisedImages.length)
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages = 0
                span.innerHTML = numImages;

            }else {
                neutralImages.splice(0, neutralImages.length)
                var span = document.getElementById(className + "Images")
                var numImages = parseInt(span.innerHTML)
                numImages = 0
                span.innerHTML = numImages;
            }
        })
    }


    train = select("#Train");
    train.mousePressed(async function(){

     await addImagesToClassifier();

        classifier.train(function(lossValue){
            if(lossValue){
                loss = lossValue;
                select("#loss").html(`Loss: ${loss} `);
            }else {
                select("#loss").html(`Finished , Final Loss: ${loss} `);
            }
        });
    });

    predict = select("#Predict")
    predict.mousePressed(classify)

    saveModel = select("#saveModel")
    saveModel.mousePressed( function(){
        classifier.save();
    })

    loadModel = select("#loadModel")
    loadModel.mousePressed(function(){
        select("#status").html("Loaded custom model")
    })

    loadModel.changed(function(){
       classifier.load(loadModel.elt.files);
    })
}

function classify() {

    classifier.classify(gotResult);
}

async function addImagesToClassifier() {

    console.log("adding images")

    for( let i = 0; i < happyImages.length; i++){
        classifier.addImage(happyImages[i], "Happy")

    }

    for( let i = 0; i< surprisedImages.length; i++){
        classifier.addImage(surprisedImages[i], "Surprised")

    }

    for( let i = 0; i< neutralImages.length; i++){
        classifier.addImage(neutralImages[i], "Neutral")

    }
}


function gotResult(error, result){
    if(error){
        console.error(error)
    }
    if(result){
        select("#result").html(result[0].label);
        select("#confidence").html(`${result[0].confidence.toFixed(2) * 100}%`)
        classify();
    }

}

function detectFaces(error, result){
    if(error){
        console.error(error)
    }


    detections = result;
    faceapi.detect(detectFaces);
}

function drawBox(detections){

    for(let i = 0; i<detections.length; i++){
        let faceBox = detections[i].alignedRect;
        let x = faceBox._box._x;
        let y = faceBox._box._y;

        let boxW = faceBox._box._width;
        let boxH = faceBox._box._height;


        noFill();
        strokeWeight(5)
        stroke(0, 0,255)
        rect(x,y, boxW, boxH)
    }
}





// My only friend, the end.