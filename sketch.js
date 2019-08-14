let fishes = [];
let alignSlider;
let cohesionSlider;
let separateSlider;

function setup() {
  createCanvas(1200, 800);
  background(50);
  angleMode(DEGREES);
  alignSlider = createSlider(0, 10, 2, 0.5);
  alignSlider.position(20, 820);
  cohesionSlider = createSlider(0, 10, 1.5, 0.5);
  cohesionSlider.position(20, 850);
  separateSlider = createSlider(0, 10, 2, 0.5);
  separateSlider.position(20, 880);
  for (let i = 0; i < 100; i++) fishes.push(new Fish());
}

function draw() {
  background(50);
  for (let fish of fishes) {
    fish.detect(fishes);
    fish.steer();
    fish.move();
    fish.show();
    fish.alignConst = alignSlider.value();
    fish.coheseConst = cohesionSlider.value();
    fish.separateConst = separateSlider.value();
  }
}
