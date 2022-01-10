// Some recurring useful functions.

// Random Function (chance = percentage, e.g. 50)
function coinToss(chance) {
    if (random() < chance / 100) {
        return true
    }
}

// Draw Guides for a grid
function drawGuides(cols,rows) {
    push()
    stroke(128)
    let xStep = width / cols
    let yStep = height / rows
    for (let x = 0; x < width; x += xStep) {
        if (x > 0) {
            line(x,0,x,height)
        }
    }
    for (let y = 0; y < height; y += yStep) {
        if (y > 0) {
            line(0,y,width,y)
        }
    }
    pop()
}

// Simple Grid Generator
function simpleGrid(zeroX, zeroY, gridCols, gridRows, gridW, gridH, arr) {
    let tileW = gridW / gridCols
    let tileH = gridH / gridRows

    let myTiles = arr
    for (let x = 0; x < gridCols; x++) {
        let xOff = zeroX + (x * tileW)
            for (let y = 0; y < gridRows; y++) {
                let yOff = zeroY + (y * tileH)
                    myTiles.push( new Tile(xOff, yOff, tileW, tileH, aInit))
            }
    }
    return myTiles
}

// Recursive Grid Generator
function recursiveGrid(zeroX, zeroY, gridCols, gridRows, gridW, gridH, initLevel, maxLevel, arr) {
    let tileW = gridW / gridCols
    let tileH = gridH / gridRows

    let myTiles = arr

    for (let x = 0; x < gridCols; x++) {
        let xOff = zeroX + (x * tileW)

            for (let y = 0; y < gridRows; y++) {
                let yOff = zeroY + (y * tileH)

                if (initLevel < maxLevel) {
                    if (coinToss(50)) {
                        myTiles.push( new Tile(xOff, yOff, tileW, tileH))
                    } else {
                        recursiveGrid(xOff, yOff, gridCols, gridRows, tileW, tileH, initLevel+1, maxLevel, myTiles)
                    }
                } else {
                    myTiles.push( new Tile(xOff, yOff, tileW, tileH))
                }

            }
    }
    return myTiles
}

// Shuffle Array (Fisher Yates Shuffle)
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://bost.ocks.org/mike/shuffle/
function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// doesn't work
// don't know if it ever did... needs some work.
function windowResized() {
    resizeCanvas(canW, canH)
    canW = container.offsetWidth
    canH = container.offsetHeight
}