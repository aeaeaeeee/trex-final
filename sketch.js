var play = 1;
var over = 0;
var gamestate = play;

var dino, run, collided;
var ground, invisible, photograph;

var cloudgroup, cloudImage;
var obstaclegroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var end, endimg, restart, reimg;
var jumpsound, checkpointsound, diesound;


function preload() {
  run = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  collided = loadAnimation("trex_collided.png");

  photograph = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  endimg = loadImage("gameOver.png");
  reimg = loadImage("restart.png");
  
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpointsound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  dino = createSprite(50, 160, 20, 50);
  dino.addAnimation("run", run);
  dino.addAnimation("collided", collided);
  dino.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("photograph", photograph);
  ground.x = ground.width / 2;

  end = createSprite(300, 100);
  end.addImage(endimg);
  
  restart = createSprite(300, 140);
  restart.addImage(reimg);
  
  end.scale = 0.5;
  restart.scale = 0.5;
  
  
  dino.setCollider("circle", 0, 0, 40);
  
  invisible = createSprite(200, 189, 400, 10);
  invisible.visible = false;

  obstaclegroup = createGroup();
  cloudgroup = createGroup();

  score = 0;
}

function draw() {
  background(180);
  fill("black");
  text("Score: " + score, 500, 50);

  if (gamestate === play) {
    end.visible = false;
    restart.visible = false;
   
    ground.velocityX = -(4 + 2* score/100);
    
    score = score + Math.round(frameCount / 100);
    
    
    if(score>0 && score%1000 === 0)
    {checkpointsound.play();}
    
    
    
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && dino.y >= 100) {
      dino.velocityY = -11.5;
      jumpsound.play();
    }

    dino.velocityY = dino.velocityY + 1.5;

    spawnobstacles();
    spawnclouds();

    if (obstaclegroup.isTouching(dino)) {
      gamestate = over;
      diesound.play();
    }
  } 
   else if (gamestate === over) {
     end.visible = true;
     restart.visible = true;
    
    ground.velocityX = 0;
    dino.velocityX = 0;
    
    dino.changeAnimation("collided", collided);
    
    obstaclegroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    
    obstaclegroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart))
     {
       reset();
       
    }
  }


  dino.collide(invisible);

  drawSprites();
}

function reset()
{
  gamestate = play;
  
  end.visible = false;
  restart.visible = false;

  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  
  dino.changeAnimation("run", run);
  
  score = 0;
  velocity = -(4 + 2* score/100);
}

function spawnobstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -5;

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    obstacle.scale = 0.55;
    obstacle.lifetime = 130;

    obstaclegroup.add(obstacle);
  }
}


function spawnclouds() {
  if (frameCount % 100 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.6;
    cloud.velocityX = -5;

    cloud.lifetime = 130;

    cloud.depth = dino.depth;
    dino.depth = dino.depth + 1;
    cloudgroup.add(cloud);
  }
}