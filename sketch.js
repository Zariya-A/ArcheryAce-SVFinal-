const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var bgImg, arrowImg, bowImg, bullseyeImg;

var canW, canH;

var life = 3;
var score = 0;
var gameState = 0;

var keyEvent = false;

var randomY = Math.floor(Math.random()*600/2);

//var loseAudio, winAudio, gameAudio;

function preload(){
  bgImg = loadImage('pics/bg.jpg');
  arrowImg = loadImage('pics/arrow.png');
  bowImg = loadImage('pics/bow.png');
  bullseyeImg = loadImage('pics/bullseye.png');
  slimeImg = loadImage('pics/slime.png');

  //loseAudio = loadSound('sounds/lose.wav');
  //winAudio = loadSound('sounds/win.wav');
  //gameAudio = loadSound('sounds/soundtrack.mp3');
}

function setup() {
  /*var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth, displayHeight);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }*/

  createCanvas(900, 700);

  engine = Engine.create();
  world = engine.world;

  //ground1 = new Ground(200, 690, 2000, 20);
  //ceiling1 = new Ground(200, 10, 2000, 20);

  ground = createSprite(200, 690, 2000, 20);
  ground.visible = false;

  ceiling = createSprite(200, 10, 2000, 20);
  ceiling.visible = false;

  bow = createSprite(70, height/2, 50, 50);
  bow.addImage(bowImg);
  bow.scale = 0.5;

  bullseye = createSprite(700, height/2, 50, 50);
  bullseye.addImage(bullseyeImg);
  bullseye.scale = 0.5;

  bullseye.velocityY += 10;


  arrowGroup = new Group();
  
  slimeWall = createSprite(950, height/2, 25, 700);
  slime = createSprite(810, height/2, 50, 50);
  slime.addImage(slimeImg);
  slime.scale = 0.79


}

function draw() 
{
  background(bgImg);
  //image(bgImg, 0, 0, displayWidth, displayHeight);

  Engine.update(engine);

  if(gameState===0){

    textSize(30);
    fill("blue");
    text("Try to score more than 1000 points", 200, 300);
    text("Press the arrow keys to move up and down", 150, 350);
    text("Or press the 's' key to use your mouse", 175, 400);
    text("Press the space key to start", 225, 450);

    start();
    moveBullseye();
  }

  if(gameState===1){
    arrowMovement();
    shootArrows();
    moveBullseye();
    myMouse();
    scoreSystem();
    stuck();
    nextLevel();
    over();
    
    //gameAudio.setVolume(0.5);
    //gameAudio.rate(0.01);
    //gameAudio.play();

    textSize(25);
    fill("black")
    text("Score: " + score, 50, 50);
    
  }

  if(gameState===2){
    arrow.visible = false;
    bullseye.visible = false;
    slime.visible = false;
    bow.visible = false;
    arrowGroup.visible = false;
    slimeWall.visible = false;

    //loseAudio.play();

    textSize(30);
    fill("blue");
    text("You Win!", 350, 300);
    text("Your Score Was: " + score, 310, 350);
  }

  if(gameState===3){
    arrow.visible = false;
    bullseye.visible = false;
    slime.visible = false;
    bow.visible = false;
    arrowGroup.visible = false;
    slimeWall.visible = false;

    //loseAudio.play();

    textSize(30);
    fill("blue");
    text("You Lose", 350, 300);
    text("Your Score Was: " + score, 310, 350);
  }
  //ground1.show();
  //ceiling1.show();


  drawSprites();
   
}

function arrowMovement(){

  
    
    if(keyDown(UP_ARROW)){
      keyEvent = false;
      bow.y -= 10;
    }

    if(keyDown(DOWN_ARROW)){
      bow.y += 10;
    }



}

function shootArrows(){
  
  if(keyDown("space")){
    createArrows();

    if(arrow.x > 650){
      setTimeout(function(){
        createArrows();
      }, 5000);
    }

  }  
  if(keyDown("s")){
    keyEvent = true;
    myMouse();
  }
}

function createArrows(){
  arrow = createSprite(150, width/2, 50,20);
  arrow.y = bow.y-20;
  arrow.addImage(arrowImg);
  arrow.scale = 0.12;
  arrow.velocityX = 7;
  arrowGroup.add(arrow);
}

function moveBullseye(){

  if(bullseye.isTouching(ground)){
    bullseye.velocityY -= 1;
  }

  if(bullseye.isTouching(ceiling)){
    bullseye.velocityY += 1;
  }

}

function myMouse(){
  if(keyEvent === true){
    bow.y = mouseY;
  }
}

function scoreSystem(){
  if(arrowGroup.isTouching(bullseye)){
    score += 5;
    score = score + Math.round(getFrameRate()/60);
    arrow.destroy();

    //bullseye.y = random;
    //bullseye.x = 800;
  }
}

function stuck(){
  if(arrowGroup.collide(slimeWall)){
    score -= 5;
    score = score + Math.round(getFrameRate()/60);
    slime.depth = arrow.depth;
    arrow.depth++;
    console.log(arrow.depth);

  }
}

function nextLevel(){
  if(score >= 1000){
    gameState = 2;
  }
}

function over(){
  if(score < 0){
    gameState = 3;
  }
}

function start(){
  if(keyDown("space")){
    gameState = 1;
  }
}