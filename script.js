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
      this.size = 10;
      this.velocityX = 1;
      this.velocityY = 1;
    }
    draw(context) {
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  // handle entire effect
  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById("image1");
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      // center image
      this.x = this.centerX - this.image.width / 2;
      this.y = this.centerY - this.image.height / 2;
    }
    init() {
      for (let i = 0; i < 100; i++) {
        this.particlesArray.push(new Particle(this));
      }
    }
    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
      // drawImage(imageSource, positionX, positionY, imageWidth, imageHeight)
      context.drawImage(this.image, this.x, this.y);
    }
    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }
  }
  const effect = new Effect(canvas.width, canvas.height);
  effect.init();

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    effect.update();
    requestAnimationFrame(animate);
  }
});
