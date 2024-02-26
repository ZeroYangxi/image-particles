window.addEventListener("load", function () {
  // after loaded
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  canvas.width = window.innerHeight;
  canvas.height = window.innerWidth;

  // individual particles
  class Particle {
    // on HTML canvas, particle as rectangle will be drawn faster than circle
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originX = Math.floor(x); // original positionX of pixel in the image
      this.originY = Math.floor(y); // original positionY pf pixel in the image
      this.color = color; //rgb color
      this.size = 10;
      this.velocityX = Math.random() * 2 - 1;
      this.velocityY = Math.random() * 2 - 1;
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
      this.gap = 5; // gap for pixelated image
    }
    // particles recreating image
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data; //
      // if alpha > 0, it is non-transparent pixel, create a particle represents it

      // make image pixelated by gap
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3]; //opacity
          const color = `rgb(${red},${green},${blue})`;
          // each pixel is represented by red, green, blue, alpha in the array, 所以乘4
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
      // drawImage(imageSource, positionX, positionY, imageWidth, imageHeight)
    }
    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }
  }
  const effect = new Effect(canvas.width, canvas.height);
  effect.init(context);

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    effect.update();
    requestAnimationFrame(animate);
  }
  // animate();
});
