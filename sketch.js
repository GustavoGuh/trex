//Variáveis
var trex, trex_running, trex_collided, trex_low;
var teste = 8;
var edges;

var ground, groundImage;
var InvisibleGround;

var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var Score;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, restart;
var gameOverImg, restartImg;

var jumpSound, dieSound, checkSound;

//teste para a aula 


//carregamento de sons e imagens 
function preload() {

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_low = loadAnimation("trex_low1.png", "trex_low2.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkPoint.mp3");
}


//configuração de elementos 
function setup() {
  createCanvas(windowWidth,windowHeight);

  //var local: está dentro de uma função





  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("low", trex_low);
  trex.scale = 0.5;

  ground = createSprite(width/2,height-20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(width/2, height/2+40);
  restart.addImage(restartImg);
  restart.visible = false;

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  InvisibleGround = createSprite(width/2, height-10, width, 10);
  InvisibleGround.visible = false;

  obstaculoG = new Group();
  nuvenG = new Group();

  //trex.debug = true;

  Score = 0;

}


function draw() {
  background("white");

  //console.log(mensagem);
  //como fazer texto na tela
  text("pontuação: " + Score, width-100, 50);

  //console.log(mensagem);




  if (gameState === PLAY) {
    ground.velocityX = -5;

    Score = Score + Math.round(getFrameRate() / 60);

    //if (Score > 0 && Score % 100 === 0) {
    //checkSound.play();
    // }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (touches.length>0||keyDown("space")) {
      if(trex.y >= height-40){
      trex.velocityY = -15;
      jumpSound.play();
      touches = [];

      }
    }

    trex.velocityY = trex.velocityY + 0.5;

    if (keyDown(DOWN_ARROW)) {
      trex.velocityY = trex.velocityY + 1;
      if (trex.y >= 160) {
        trex.changeAnimation("low", trex_low);
        trex.setCollider("rectangle", -5, 20, 110, 50);
      }
    } else {
      trex.changeAnimation("running", trex_running);
      trex.setCollider("rectangle", 0, 0, 80, 90);
    }
    trex.velocityY = trex.velocityY + 0.5;

    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  }

  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;

    trex.changeAnimation("collided", trex_collided);

    obstaculoG.setLifetimeEach(-1);
    nuvenG.setLifetimeEach(-1);

    obstaculoG.setVelocityXEach(0);
    nuvenG.setVelocityXEach(0);


    //criar o if para o reset
    if(mousePressedOver(restart)||touches.length>0){
    touches = []; 
    reset();
    }
  

  

  }


  //trex colidindo com o chão invisível
  trex.collide(InvisibleGround);


  drawSprites();
}

//criar a função reset
  function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaculoG.destroyEach();
  nuvenG.destroyEach();
  trex.changeAnimation("running",trex_running);
  Score = 0;
  }









function criarobstaculos() {
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(width+10, height-35, 10, 40);
    obstaculo.velocityX = -(6 + Score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
        break;

      case 3: obstaculo.addImage(obstaculo3);
        break;

      case 4: obstaculo.addImage(obstaculo4);
        break;

      case 5: obstaculo.addImage(obstaculo5);
        break;

      case 6: obstaculo.addImage(obstaculo6);
        break;

      default: break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width+10;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {

  if (frameCount % 60 == 0) {
    cloud = createSprite(width+10, height-100, 10, 10);
    cloud.y = Math.round(random(height-150, height-100));
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -4;

    //tempo de vida  
    cloud.lifetime = width+10;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);
  }
}
