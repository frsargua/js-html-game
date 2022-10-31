const canvas = document.getElementById("canvas");

const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue");
player.draw();

const projectiles = [];

function animate() {
  requestAnimationFrame(animate);
  projectiles.forEach((projectile) => {
    projectile.update();
  });
}
function getAngle(clickX, clickY) {
  console.log(clickX, clickY);
  const angle = Math.atan2(
    clickY - canvas.height / 2,
    clickX - canvas.width / 2
  );
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

window.addEventListener("click", (event) => {
  let projectileVelocity = getAngle(event.clientX, event.clientY);
  projectiles.push(new Projectile(x, y, 5, "red", projectileVelocity));
  animate();
});
