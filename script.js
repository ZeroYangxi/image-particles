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
      this.size = this.effect.gap - 1; // size of particles match gap, minus 1 to get some spaces
      this.velocityX = 0;
      // Math.random() * 2 - 1;
      this.velocityY = 0;
      this.ease = Math.random() * 0.1; // easing factor, the particles speed to go back to the image
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      // particle recreates itself,
      // particles are aware of the difference of their location to original location
      // 引入一个缓动系数(easing factor/damping factor)（例如0.1），使得粒子每次只移动剩余距离的一小部分
      // 在每次调用update方法时，将粒子朝向其原始位置移动一小步。
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;
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
      this.gap = 3;
      // gap for pixelated image, the lower the more pixels
      // lower means higher resolution, but slower
    }

    // initialize particles that recreate image
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data; //
      // if alpha > 0, it is non-transparent pixel, create a particle represents it

      // make image pixelated by gap
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const alpha = pixels[index + 3]; //opacity
          if (alpha > 0) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const color = `rgb(${red}, ${green}, ${blue})`;
            // each pixel is represented by red, green, blue, alpha in the array, 所以乘4
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
  // console.log(effect.particlesArray);

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    effect.update();
    requestAnimationFrame(animate);
  }
  animate();
});
