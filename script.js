document.addEventListener("DOMContentLoaded", function () {
  // after loaded
  let base64 = 0;
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let image = document.getElementById("image1");

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
      // 随靠近终点逐渐减小速度的easing factor
      this.ease = Math.random() * 0.5; // easing factor, the particles speed to go back to the image
      // 随时间推移逐渐减小速度的fraction
      this.friction = 0.5; // 介于0（完全的摩擦，立即停止）和1（无摩擦，不减速）之间
      // mouse move implementation
      // distance: cursor between particles
      this.distanceX = 0;
      this.distanceY = 0;
      this.distance = 0;
      // force: 因鼠标移动而作用于粒子上的力
      // force的值是负的，意味着力是将粒子从鼠标位置推开。
      this.force = 0;
      this.angle = 0; // direction of articles
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      // the distance between mouse and current location
      this.distanceX = this.effect.mouse.x - this.x;
      this.distanceY = this.effect.mouse.y - this.y;
      // 勾股定理算距离，remove Math.sqrt(）for performance reason
      this.distance =
        this.distanceX * this.distanceX + this.distanceY * this.distanceY;
      // particles push harder when near mouse
      // 去掉除以0的错误，同时让力变大
      const forceMultiplier = 100; // 增加鼠标影响力
      if (this.distance === 0) {
        this.force = -this.effect.mouse.radius * forceMultiplier;
      } else {
        this.force =
          (-this.effect.mouse.radius * forceMultiplier) / this.distance;
      }

      if (this.distance < this.effect.mouse.radius) {
        // Math.atan2() 返回从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)，也就是 Math.atan2(y,x)
        // -PI ~ PI, 参数接受(y, x)
        this.angle = Math.atan2(this.distanceY, this.distanceX);
        // 更新速度
        this.velocityX += this.force * Math.cos(this.angle); // cos把角度转换为一个01~1的
        this.velocityY += this.force * Math.sin(this.angle);
      }

      // particle recreates itself,
      // particles are aware of the difference of their location to original location
      // 引入一个缓动系数(easing factor/damping factor)（例如0.1），使得粒子每次只移动剩余距离的一小部分
      // 在每次调用update方法时，将粒子朝向其原始位置移动一小步。

      // 应用摩擦力, 速度随时间推移逐渐减小
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      // 更新位置
      this.x += this.velocityX + (this.originX - this.x) * this.ease;
      this.y += this.velocityY + (this.originY - this.y) * this.ease;
    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.01;
    }
  }

  // handle entire effect
  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = image;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      // center image
      this.x = this.centerX - this.image.width / 2;
      this.y = this.centerY - this.image.height / 2;
      this.gap = 3;
      // gap for pixelated image, the lower the more pixels
      // lower means higher resolution, but slower
      this.mouse = {
        radius: 300, // area around the cursor, between cursor and particles
        x: undefined,
        y: undefined,
      };
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });
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
    warp() {
      this.particlesArray.forEach((particle) => particle.warp());
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
  // warp button
  const warpButton = document.getElementById("warpButton");
  warpButton.addEventListener("click", function () {
    effect.warp();
  });

  animate();

  // 当文件输入发生变化时执行这个函数
  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      // 获取用户选择的文件
      let file = event.target.files[0];
      // 确保文件存在
      if (file) {
        let reader = new FileReader();

        // 设置当读取操作完成后要执行的函数
        reader.onload = function (e) {
          // 获取转换后的Base64编码
          base64 = e.target.result;
          console.log(base64);

          // // 显示Base64编码，或者将其用作图片预览
          // document.getElementById("result").innerHTML =
          //   '<p>Base64 code:</p><textarea rows="5" cols="70">' +
          //   base64 +
          //   '<h2>Image Preview:</h2></textarea><br><br><img src="' +
          //   base64 +
          //   '" alt="Image Preview"/>';
        };

        // 以DataURL的形式读取文件，结果会是一个Base64编码的字符串
        reader.readAsDataURL(file);
      }
    });

  image.onload = function () {
    // 清空现有的粒子数组以准备新的效果
    effect.particlesArray = [];
    // 重新初始化效果以匹配新的图片
    effect.init(context);
    animate();
  };

  //convert button
  const convertButton = document.getElementById("convertButton");
  convertButton.addEventListener("click", function () {
    image.src = `${base64}`; //替换新的
    image.onload();
  });
});
