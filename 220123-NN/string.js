//Suche lohnt sich!
// Die Originalklasse GuitarString kommt von hier https://editor.p5js.org/sventi555/sketches/uwyAtCQxh

// Falls ihr Fragen zur Klassenerstellung habt, schreibt mir gerne auf Discord 
const AMP_MULT = 50;

class GuitarString {
  constructor(freq, midPoint) {
    this.isVibrating = false;
    this.freq = freq;
    this.amp = 0;
    this.framesSincePluck = 0;
    this.length = width;
    this.mid = midPoint;
    this.weight = 200;
    
  }
  
  draw() {
    if (!this.isVibrating) {
      line(this.mid.x - this.length/2, this.mid.y, this.mid.x + this.length/2, this.mid.y);
    } else {
     
      noFill()
      beginShape();
      for (let x = 0; x < this.length; x++) {

        const y = this.amp * Math.sin((TWO_PI * x)/(this.length * 2)) * Math.cos(TWO_PI * this.freq * this.framesSincePluck/60) * AMP_MULT;
        vertex(this.mid.x + x - this.length/2, this.mid.y - y)
      }
      endShape();
    }
  }
  
  update() {
    if (this.isVibrating) {
      this.amp *= 0.95;
      this.framesSincePluck += 1;
      
      if (this.amp < 0.05) {
        this.isVibrating = false;
        this.amp = 0;
        this.framesSincePluck = 0;
      }
    }
  }
  
  pluck() {
    this.isVibrating = true;
    this.amp = 1;
    this.framesSincePluck = 0;
  }

  setVal(freq) {
      this.freq = freq;
  }

}