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

class Enemy {
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

const projectiles = [];
const enemies = [];

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  enemies.forEach((enemy, indexEnemy) => {
    enemy.update();

    const distEnd = Math.hypot(
      canvas.width / 2 - enemy.x,
      canvas.height / 2 - enemy.y
    );
    console.log(distEnd);
    if (distEnd - enemy.radius - player.radius < 1) {
      location.reload();
    }
    projectiles.forEach((projectile, indexProjectile) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        enemy.radius -= 4;
        if (enemy.radius <= 0) {
          enemies.splice(indexEnemy, 1);
        }
        projectiles.splice(indexProjectile, 1);
      }

      if (
        projectile.x + projectile.radius > canvas.width ||
        projectile.y + projectile.radius > canvas.height ||
        projectile.x - projectile.radius < 0 ||
        projectile.y - projectile.radius < 0
      ) {
        setTimeout(() => {
          projectiles.splice(indexProjectile, 1);
        }, 0);
      }
    });
  });
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
    }
    const color = "pink";

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);
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
});

animate();
// spawnEnemies();
