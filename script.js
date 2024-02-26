window.addEventListener("load", function () {
  // after loaded
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  canvas.width = window.innerHeight;
  canvas.height = window.innerWidth;

  // individual particles
  class Particle {
    // on HTML canvas, particle as rectangle will be drawn faster than circle
    constructor(effect) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.size = 30;
    }
    draw(context) {
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  // handle entire effect
  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById("image1");
    }
    init() {
      for (let i = 0; i < 10; i++) {
        this.particlesArray.push(new Particle(this));
      }
    }
    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
      // drawImage(imageSource, positionX, positionY, imageWidth, imageHeight)
      context.drawImage(this.image, 0, 0, 200, 200);
    }
  }
  const effect = new Effect(canvas.width, canvas.height);
  effect.init();
  effect.draw(context);
  // context.fillRect(0, 100, 20, 200);

  // context.drawImage(image1, 0, 0, 200, 200);
});
