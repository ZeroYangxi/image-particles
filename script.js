window.addEventListener("load", function () {
  // after loaded
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  canvas.width = window.innerHeight;
  canvas.height = window.innerWidth;

  const image1 = document.getElementById("image1");
  class Particle {
    // on HTML canvas, particle as rectangle will be drawn faster than circle
    constructor() {
      this.x = 10;
      this.y = 10;
      this.size = 30;
    }
    draw() {
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  class Effect {}

  const particle1 = new Particle();
  particle1.draw();
  function animate() {}

  // context.fillRect(0, 100, 20, 200);
  // // drawImage(imageSource, positionX, positionY, imageWidth, imageHeight)
  // context.drawImage(image1, 0, 0, 200, 200);
});
