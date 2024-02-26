window.addEventListener("load", function () {
  // after loaded
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  context.width = window.innerWidth;
  context.height = window.innerHeight;

  class Particle {}
});
