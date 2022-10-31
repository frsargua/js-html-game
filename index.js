const canvas = document.getElementById("canvas");
const startGameEl = document.getElementById("card--container");
const scoreContainerEl = document.getElementById("score--container");
const scoreEl = document.getElementById("score");
const connerScoreEl = document.getElementById("conner--score");

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

let player;
let projectiles;
let enemies;
let score;

function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  score = 0;
}

let animator;
function animate() {
  animator = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1";
  c.fillRect(0, 0, canvas.width, canvas.height);
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
    if (distEnd - enemy.radius - player.radius < 1) {
      startGameEl.style.display = "flex";
      scoreContainerEl.innerText = score;
      scoreContainerEl.style.display = "block";
      cancelAnimationFrame(animator);
    }
    projectiles.forEach((projectile, indexProjectile) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        enemy.radius -= 7;
        if (enemy.radius <= 5) {
          score += 100;
          enemies.splice(indexEnemy, 1);
        }
        score += 100;
        connerScoreEl.innerText = score;
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
    const radius = Math.random() * (30 - 8) + 8;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = { x: Math.cos(angle) * 4, y: Math.sin(angle) * 4 };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);
}

function getAngle(clickX, clickY) {
  const angle = Math.atan2(
    clickY - canvas.height / 2,
    clickX - canvas.width / 2
  );
  return { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
}

function shotProjectile(time) {
  //   let projectileVelocity = velocity;
  let lastMove = 0;
  let projectileVelocity = { x: 0, y: 0 };
  setInterval(() => {
    projectiles.push(new Projectile(x, y, 5, "pink", projectileVelocity));
  }, time);
  window.addEventListener("mousemove", (event) => {
    if (Date.now() - lastMove > time) {
      projectileVelocity = getAngle(event.clientX, event.clientY);
      lastMove = Date.now();
    }
  });
}

function runGame() {
  console.log(scoreContainerEl.style);
  init();
  animate();
  spawnEnemies();
  shotProjectile(400);
  startGameEl.style.display = "none";
}
