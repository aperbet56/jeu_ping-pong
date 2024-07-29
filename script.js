// Récupération de l'élément HTML canvas
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
  paddleHeight = 120,
  paddleSpeed = 8,
  ballRadius = 12,
  initialBallSpeed = 8,
  maxBallSpeed = 40,
  netWidth = 5,
  netColor = "WHITE";

// Déclaration de la fonction drawNet qui va permettre de dessiner le filet
const drawNet = () => {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
  }
};

// Déclaration de la fonction drawRect qui va permettre de dessiner un rectangle
const drawRect = (x, y, width, height, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

// Déclaration de la fonction drawCircle qui va permettre de dessiner un cercle
const drawCircle = (x, y, radius, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
};

// Déclaration de la fonction drawText qui va permettre de dessiner du texte
const drawText = (
  text,
  x,
  y,
  color,
  fontSize = 60,
  fontWeight = "bold",
  font = "Courier New"
) => {
  context.fillStyle = color;
  context.font = `${fontWeight} ${fontSize}px ${font}`;
  context.textAlign = "center";
  context.fillText(text, x, y);
};

// Déclaration de la fonction createPaddle qui va permettre de créer un paddle
const createPaddle = (x, y, width, height, color) => {
  return { x, y, width, height, color, score: 0 };
};

//  Déclaration de la focntion create Ball qui va permettre de créer une balle
const createBall = (x, y, radius, velocityX, velocityY, color) => {
  return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
};

// Définer utilisateur et ordinateur paddle objects
const user = createPaddle(
  0,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  "WHITE"
);

const com = createPaddle(
  canvas.width - paddleWidth,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  "WHITE"
);

// Définer l'objet ball
const ball = createBall(
  canvas.width / 2,
  canvas.height / 2,
  ballRadius,
  initialBallSpeed,
  initialBallSpeed,
  "WHITE"
);

// Déclaration de la fonction movePaddle qui va permettre de bouger le paddle
const movePaddle = (e) => {
  const rect = canvas.getBoundingClientRect();
  user.y = e.clientY - rect.top - user.height / 2;
};

// Ecoute de l'évément "mousemove" sur le canvas et appel de la fonction movePaddle
canvas.addEventListener("mousemove", movePaddle);

// Rechercher si collision entre la balle et le paddle
const collision = (b, p) => {
  return (
    b.x + b.radius > p.x &&
    b.x - b.radius < p.x + p.width &&
    b.y + b.radius > p.y &&
    b.y - b.radius < p.y + p.height
  );
};

// Déclaration de la fonction resetBall qui va permettre de remettre à zéro de la postion de la balle et de sa vitesse
const resetBall = () => {
  ball.x = canvas.width / 2;
  ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
  ball.velocityX = -ball.velocityX;
  ball.speed = initialBallSpeed;
};

// Déclaration de la fonction Update qui va mettre à jour la logique du jeu
const update = () => {
  // considtion if
  if (ball.x - ball.radius < 0) {
    // Ingrémentation du score de l'ordinateur
    com.score++;
    // Appel de la fonction resetBall
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    // Ingrémentation du score de l'utilisateur
    user.score++;
    // Appel de la fonction resetBall
    resetBall();
  }

  // Mise à jour de la position de la balle
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //Mise à jour de la position du paddle de l'ordinateur en fonction de la position de la balle
  com.y += (ball.y - (com.y + com.height / 2)) * 0.05;

  // Haut et bas des murs
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // Détermine quel paddle commence à toucher la balle et gérer la collision
  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
  if (collision(ball, player)) {
    const collidePoint = ball.y - (player.y + player.height / 2);
    const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
    const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
    ball.velocityY = ball.speed * Math.sin(collisionAngle);

    // Augmenter la vitesse de la balle et la limiter à maxBallSpeed
    ball.speed += 0.2;
    if (ball.speed > maxBallSpeed) {
      ball.speed = maxBallSpeed;
    }
  }
};

// Déclaration de la fonction render qui va permettre le rendu visuel
const render = () => {
  // Appel de la fonction drawRect
  drawRect(0, 0, canvas.width, canvas.height, "BLACK");
  // Appel de la fonction drawNet
  drawNet();

  // Appel de la fonction drawText pour dessiner les textes
  drawText(
    user.score,
    canvas.width / 4,
    canvas.height / 2,
    "GRAY",
    120,
    "bold"
  );
  drawText(
    com.score,
    (3 * canvas.width) / 4,
    canvas.height / 2,
    "GRAY",
    120,
    "bold"
  );

  // Appels de la fonction drawRect pour dessiner les paddles
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  // Appel de la fonction drawCircle pour dessiner la balle
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
};

// Déclaration de la fonction gameLoop (boucle du jeu)
const gameLoop = () => {
  // Appel de la fonction update
  update();
  // Appel de la fonction render
  render();
};

// Régler la fonction gameLoop pour qu'elle s'exécute à 60 images par seconde
const framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec);
