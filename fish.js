class Fish {
  constructor() {
    this.maxSpeed = 3;
    this.maxSteering = 0.1;
    this.vision = 50;
    this.size = 5;

    this.avoidConst = 0.3;
    this.alignConst = 2;
    this.coheseConst = 1.5;
    this.separateConst = 2;

    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-2, 2), random((-2, 2)));
    this.velocity.setMag(this.maxSpeed);
    this.steering = createVector(0, 0);

    this.nearby = [];
  }

  detect(fishes) {
    this.nearby = [];

    for (let fish of fishes) {
      let distance = dist(
        this.position.x,
        this.position.y,
        fish.position.x,
        fish.position.y
      );
      if (distance > 0 && distance < this.vision) {
        this.nearby.push(fish);
      }
    }
  }

  checkWall() {
    let avoidAngle = createVector();
    let distance = dist(
      this.position.x,
      this.position.y,
      width,
      this.position.y
    );
    if (distance < this.vision) {
      avoidAngle.add(createVector(-1 / distance, 0));
    }

    distance = dist(this.position.x, this.position.y, 0, this.position.y);
    if (distance < this.vision) {
      avoidAngle.add(createVector(1 / distance, 0));
    }

    distance = dist(this.position.x, this.position.y, this.position.x, height);
    if (distance < this.vision) {
      avoidAngle.add(createVector(0, -1 / distance));
    }

    distance = dist(this.position.x, this.position.y, this.position.x, 0);
    if (distance < this.vision) {
      avoidAngle.add(createVector(0, 1 / distance));
    }

    avoidAngle.setMag(1);

    return avoidAngle;
  }

  align() {
    let avgAlignment = createVector();

    if (this.nearby.length > 0) {
      for (let fish of this.nearby) {
        avgAlignment.add(fish.velocity);
      }

      avgAlignment.div(this.nearby.length);
      avgAlignment.setMag(this.maxSpeed);
      avgAlignment.sub(this.velocity);
      avgAlignment.limit(this.maxSteering);
    }
    return avgAlignment;
  }

  cohese() {
    let avgPosition = createVector();

    if (this.nearby.length > 0) {
      for (let fish of this.nearby) {
        avgPosition.add(fish.position);
      }

      avgPosition.div(this.nearby.length);
      avgPosition.sub(this.position);
      avgPosition.setMag(this.maxSpeed);
      avgPosition.sub(this.velocity);
      avgPosition.limit(this.maxSteering);
    }

    return avgPosition;
  }

  separate() {
    let separationVector = createVector();

    if (this.nearby.length > 0) {
      for (let fish of this.nearby) {
        let d = dist(
          this.position.x,
          this.position.y,
          fish.position.x,
          fish.position.y
        );
        let difference = p5.Vector.sub(this.position, fish.position);
        difference.div(d * d);
        separationVector.add(difference);
      }

      separationVector.div(this.nearby.length);
      separationVector.setMag(this.maxSpeed);
      separationVector.sub(this.velocity);
      separationVector.limit(this.maxSteering);
    }
    return separationVector;
  }

  steer() {
    let avoid = this.checkWall();
    let alignment = this.align();
    let cohesion = this.cohese();
    let separation = this.separate();

    avoid.mult(this.avoidConst);
    alignment.mult(this.alignConst);
    cohesion.mult(this.coheseConst);
    separation.mult(this.separateConst);

    this.steering.add(avoid);
    this.steering.add(alignment);
    this.steering.add(cohesion);
    this.steering.add(separation);
  }

  move() {
    this.position.add(this.velocity);
    this.velocity.add(this.steering);
    this.velocity.limit(this.maxSpeed);
    this.steering.mult(0);
  }

  show() {
    push();
    stroke(255);

    noFill();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + 90);
    triangle(
      -this.size,
      2 * this.size,
      this.size,
      2 * this.size,
      0,
      -2 * this.size
    );

    pop();
  }
}
