//Creating sprite using sprite sheets for animation
const TILE_SIZE = 70;
const TOTAL_COLUMNS = 9;
const TOTAL_ROWS = 6;
const CANVAS_WIDTH = 800;//TILE_SIZE * TOTAL_COLUMNS;
const CANVAS_HEIGHT = 600;//TILE_SIZE * TOTAL_ROWS;

let canvas;

let props = [];
let bgprops = [];
let sprites = [];
let physProps = [];
let npcSprites = [];

let UISprites = [];

//let beesReleased = false;
let beeState = 0; //0:nothing,1:ready,2:theyre out. oh no
let releaseButton;
let controlsIntro;
var readyImgSizeIndex =40;
//et arrowSprite;


let currX = 0;
var player;
var gameState;
var paused = true;
var pauseEnabled = false;
var preGame = true;




//Math stuff
const clamp = (min, max) => (value) =>
    value < min ? min : value > max ? max : value;

const rows = Array.from({length: TOTAL_ROWS});
rows.forEach((row, i) => {
  rows[i] = Array.from({ length: TOTAL_COLUMNS}, e => null);
})

let tile_sprite_sheet;


function preload() {
  console.log("Preload...");
  // Load the json for the tiles sprite sheet
  props[0] = loadImage('img/cactus1.png');
  props[1] = loadImage('img/cactus2.png');
  props[2] = loadImage('img/cactus3.png');
  //props[3] = loadImage('img/block.png');
  bgprops[0] = loadImage('img/ground.png');
  bgprops[1] = loadImage('img/bg1.png');
  bgprops[2] = loadImage('img/bg2.png');
  sprites[0] = loadImage('img/dog5.png');
  sprites[1] = loadImage('img/dogrun.gif');
  /*sprites[2] = loadImage('img/dashdustL.gif');
  sprites[3] = loadImage('img/dashdustR.gif');*/
  sprites[3] = loadImage('img/dogCrouch.png');
  physProps[0] = loadImage('img/rock3.png');
  physProps[1] = loadImage('img/flower-top.png');
  physProps[2] = loadImage('img/cyclops.png');
  npcSprites[0] = loadImage('img/bee2.png');
  npcSprites[1] = loadImage('img/bee3.png');
  UISprites[0] = loadImage('img/UI/arrowanim.gif');
  
  UISprites[1] = loadImage('img/UI/arrowanimr.gif');
  UISprites[2] = loadImage('img/UI/restartinfo.png');
  UISprites[3] = loadImage('img/UI/pauseinfo.png');
  UISprites[4] = loadImage('img/UI/READY2.png');
  UISprites[5] = loadImage('img/UI/GO.png');
  UISprites[6] = loadImage('img/UI/!!.png');
  UISprites[7] = loadImage('img/UI/controls.png');//loadImage('img/debug-box.png');
  this.gameState = new GameState();
  
  
    
    //this.sprite.addImage(image);
  //camera = new Camera(80,80,1);
  loadJSON('tiles.json', function(tile_frames) {
    // Load tiles sprite sheet from frames array once frames array is ready
    tile_sprite_sheet = loadSpriteSheet('test-spritesheet.png', tile_frames);
  });
}

function release(){

  beeState = 1;
  preGame = false;
  paused = false;
  //beesReleased = true;
  releaseButton.remove();
}

function restart(){}

function setup() {
  arrowSprite = createSprite(200,200);

  
  controlsIntro = createSprite(0,0,500,100);
  controlsIntro.addImage(UISprites[7]);
  releaseButton = createButton('ready?');
  releaseButton.position(CANVAS_WIDTH/2 - 30, CANVAS_HEIGHT/2 + 60);
  releaseButton.mousePressed(release);

  //setCamera(this.camera);
  bg = loadImage('img/sunset.png');
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.drawingContext.imageSmoothingEnabled = false;//this disables anti-aliasing

}

function draw() {
  background(bg);
  
  if(!preGame){
    this.gameState.display();
    this.gameState.drawSpriteIndividual();
  }
  
  //******
  //ellipse(camera.position.x, camera.position.y, 10, 10);
  //******
  //if(!paused){
    camera.position.x = this.player.posx;
    camera.position.y = 50;//this.player.posy + 50;
  //}
  
  if(preGame){
    controlsIntro.display();
  }
}

function drawTile(tilename, gridX, gridY){
    tile_sprite_sheet.drawFrame(tilename, TILE_SIZE * gridX, TILE_SIZE * gridY);
    rows[gridY][gridX] = tilename;
}

class GameState{
  bg2speed = 0.75;
  bg3speed = 0.95;

  inputs = [0.0,0.0];
  constructor(){
    
    
    this.bg1 = [
      //new InfiniteRepeat(bgprops[0],-600,-150),//1332
      new Ground(this,bgprops[0],-600,-150),
      new Cactus(2,-480,150), //FIXME!!!!!!!
      //new Obstacle(100,150,loadImage('img/rock2.png')),

      //new Obstacle(1000,250,props[3]),
      new Cactus(0,57000,150),
      new Cactus(2,160000,150),
      new Cactus(2,180000,150),
      new Cactus(0,181000,150),
      new Cactus(2,150000,150),
      //new Cactus(0,30000,150),
      //new Cactus(0,89600,150),
      //new Obstacle(89700,150,loadImage('img/rock2.png')),
      new Cactus(1,190000,150),
      new Cactus(0,110000,150)//,
      //new Obstacle(3000,212,UISprites[7])
      
    ];
    
    
    this.arrowImage = loadImage('img/UI/arrowanim.gif');
    this.reload();
  }
  reload(){
    this.bg3 = [
      new InfiniteRepeat(bgprops[2],-600,-150)
    ];
    this.bg2 = [
      new InfiniteRepeat(bgprops[1],-600,-150)
    ];
    self.player = new Player(this);
    this.inputs = [0.0,0.0];
    this.npcs = [
      new Swarm(-8000,200,12)
    ];
    
    this.physicsObjs = [
      new PhysObject(this,physProps[2],20330,330,30),//gs,image,inx,iny,weight)
      new PhysObject(this,physProps[0],1500,330,3),
      new PhysObject(this,physProps[0],1550,330,3),
      new PhysObject(this,physProps[0],1595,330,3),
      new PhysObject(this,physProps[1],3700,330,3),
      new PhysObject(this,physProps[1],3710,330,3),
      new PhysObject(this,physProps[1],3750,330,3),
      new PhysObject(this,physProps[1],3835,330,3),
      new PhysObject(this,physProps[1],10800,330,3),
      new PhysObject(this,physProps[1],11000,330,3),
      new PhysObject(this,physProps[1],11200,330,3),
      new PhysObject(this,physProps[1],11400,330,3),
      new PhysObject(this,physProps[1],11600,330,3),
      new PhysObject(this,physProps[1],11900,330,3),
      new PhysObject(this,physProps[1],12300,330,3),
      new PhysObject(this,physProps[0],30000,330,3),
      new PhysObject(this,physProps[0],30500,330,3),
      new PhysObject(this,physProps[0],31000,330,3),
      new PhysObject(this,physProps[0],37000,330,3),
      new PhysObject(this,physProps[0],37900,330,3),
      new PhysObject(this,physProps[0],39000,330,3)
    ];
    
    console.log("Made Gamestate");
  }

  getPlayerx(){
    return self.player.posx;
  }

  display(){//basically update

    
    if(!paused){
      this.bg3.forEach(o => o.xpos += (this.inputs[1] * this.bg3speed));
      this.bg2.forEach(o => o.xpos += (this.inputs[1] * this.bg2speed));
    }
    
    //this.cactus.display();
    this.bg3.forEach(o => o.display());
    this.bg2.forEach(o => o.display());
   
    this.bg1.forEach(o => o.display());
    this.npcs.forEach(o => o.display());
    
    
    self.player.display();
    //.display();

    this.physicsObjs.forEach(o => o.display());

    //UI------
    this.renderArrow();

    image(UISprites[3],camera.position.x + UISprites[3].width,camera.position.y - CANVAS_HEIGHT/2 +10);
    image(UISprites[2],camera.position.x -CANVAS_WIDTH/2 + 10,camera.position.y - CANVAS_HEIGHT/2 +10);
    this.renderStart();
    //--------
  }

  renderStart(){
    
    //vvv Hacky solution to animations
    if(beeState==1 && readyImgSizeIndex > 0){
      let newWidth = UISprites[4].width + readyImgSizeIndex + 40;
      let newHeight = UISprites[4].height + (readyImgSizeIndex/2) + 40;
      image(UISprites[4],camera.position.x - (newWidth/2),camera.position.y -100,UISprites[4].width + readyImgSizeIndex + 40,UISprites[4].height + (readyImgSizeIndex/2) + 40);

      //image(UISprites[4],camera.position.x,camera.position.y,UISprites[4].width + readyImgSizeIndex,UISprites[4].height + readyImgSizeIndex);
      
      readyImgSizeIndex -= 1;
      
    } else if (beeState==1 && readyImgSizeIndex > (-30)){
      image(UISprites[5],camera.position.x-60,camera.position.y-100,UISprites[5].width + 40, UISprites[5].height + 40);
      readyImgSizeIndex -= 0.7;
    } else if (beeState==1 && readyImgSizeIndex <= (-30)){
      pauseEnabled = true;
      
      beeState = 2;
    }
  }
  renderArrow(){
    //if gif dont work just loop images
    //ALSO>>> MAKE SURE NOT PAUSED
    if(beeState==2){
      //console.log("dummy log");
      let maxShrinkDistance = 2000;
      let minSize = 50;
      
      if(this.npcs[0].posx < player.posx -CANVAS_WIDTH/2){
        //image(UISprites[0],camera.position.x-CANVAS_WIDTH/2,-30);
        let fixedDistance = clamp(0,maxShrinkDistance)(camera.position.x -  this.npcs[0].posx);
        let temp = fixedDistance/minSize + 10;
        image(UISprites[0],camera.position.x - CANVAS_WIDTH/2 + (600/temp),30,(1200/temp),(1200/temp)-10);
        image(UISprites[6],camera.position.x - CANVAS_WIDTH/2 + (1200/temp) +(600/temp),30,(1200/temp),(1200/temp)-10);
      }
      if(this.npcs[0].posx > player.posx + CANVAS_WIDTH/2){
        let fixedDistance = clamp(0,maxShrinkDistance)(this.npcs[0].posx - camera.position.x);
        let temp = fixedDistance/minSize + 10;
        //image(UISprites[0],camera.position.x - CANVAS_WIDTH/2 + (600/temp),30,(1200/temp),(1200/temp)-10);
        //onsole.log(fixedDistance,1200/temp);
        image(UISprites[1],camera.position.x + CANVAS_WIDTH/2 - (1200/temp),30,(1200/temp),(1200/temp)-10);
        image(UISprites[6],camera.position.x + CANVAS_WIDTH/2 - (1200/temp) -(1200/temp),30,(1200/temp),(1200/temp)-10);
      }
      
    }
  }
  drawSpriteIndividual(){
    this.bg1.forEach(o => o.draw());
  }
  pause(){}
}
class InfiniteRepeat{
  width = 1332;
  constructor(sprite,inx,iny){
    this.sprite = createSprite();
    this.sprite.addImage(sprite);
    this.image = sprite;
    this.xpos = inx;
    this.ypos = iny;
  }
  display(){
   if(camera.position.x - this.xpos >1300){
      this.xpos += 1310;
    } else if(camera.position.x - this.xpos < 0){
      this.xpos -= 1310;
    }
    image(this.image, this.xpos, this.ypos);
    image(this.image, this.xpos+this.width, this.ypos);
    image(this.image, this.xpos-this.width, this.ypos);
    //if camera position = position + half of image, display image in front
  }
  draw(){}
}
class Ground{//JUST PASTED< EDIT ME

width = 1332;
  constructor(gs,sprite,inx,iny){
    this.gameState = gs;
    this.sprite = createSprite();
    this.sprite.addImage(sprite);
    this.image = sprite;
    this.xpos = inx;
    this.ypos = iny;
  }

//current: place new to left and right 
//if to the right, current = right, left = current, and right = new to the right

  display(){

    if(camera.position.x - this.xpos >1300){
      this.xpos += 1310;
    } else if(camera.position.x - this.xpos < 0){
      this.xpos -= 1310;
    }
    image(this.image, this.xpos, this.ypos);
    image(this.image, this.xpos+this.width, this.ypos);
    image(this.image, this.xpos-this.width, this.ypos);
    this.sprite.display();
    //if camera position = position + half of image, display image in front
  }

  draw(){
    this.sprite.position.x = this.xpos + this.image.width/2;//this.xpos;// + this.image.width/2;
    this.sprite.position.y = this.ypos + this.image.height/2;// + this.image.height/2;
  }
}

class Obstacle{
  constructor(posx,posy,img){
    this.img = img;
    this.posx = posx;
    this.posy = posy- this.img.height/2;
    
    this.sprite = createSprite();
    this.sprite.addImage(img);
    this.sprite.position.x = posx;
    this.sprite.position.y = posy;
    //console.log(this.posx,this.posy,this.posy - this.img.height/2,this.img.height);
  }
  display(){
    //ellipse(this.posx, this.posy - this.img.height/2, 10, 10);
    this.sprite.display();
    var pxb = player.posy + player.image.height/2;
    var pxr = player.posx + player.image.width/2;
    var pxl = player.posx - player.image.width/2;
    var leftBound = this.posx - this.img.width/2;
    var rightBound = this.posx + this.img.width/2; 
    var top = this.posy - this.img.height/2;
    if((pxr>= leftBound && pxl <= rightBound) && (pxb > (top - 5) && pxb < (top+5))){//posx between and posy = top (or between acceptable ones)
      player.inputs[0] = -10;
      //console.log("A");
    }
    else if((pxr >= leftBound&& pxr <= rightBound) && pxb >= (this.posy - this.img.height/2)){
      if(pxb > this.posy - this.img.height/2){
        player.inputs[1] = 0;
        player.posx = leftBound - 1 - player.image.width/2;
      }
    } else if (pxl >= leftBound&& pxl <= rightBound){
      if(pxb >= this.posy - this.img.height/2){
        player.inputs[1] = 0;
        player.posx = rightBound + 1 + player.image.width/2;
      }
//ALSO AFFECT PARALLAX INPUTS TOO
    } 
  }
  draw(){}
}

class Cactus extends Obstacle { 
  constructor(Cindex,inx,iny){
    switch(Cindex) {
      case 0:
        super(inx,200,props[Cindex]);
        break;
      case 1:
        super(inx,190,props[Cindex]);
        break;
      case 2:
          super(inx,220,props[Cindex]);
        break;
    }
    
  }
}

class PhysObject{
  velocity = createVector(0.0,0.0);
  acceleration = createVector(0.0,0.0);
  drag = 0.05;


  constructor(gs,image,inx,iny,weight){
    this.gameState = gs;
    this.sprite = createSprite(200,200);//image.width/2,image.height/2);
    this.position = createVector(inx,iny);
    this.image = image;
    /*this.posx = inx;
    this.posy = iny;*/
    this.mass = weight;
    this.sprite.addImage(image);
    //this.sprite.mass = weight;
    //this.sprite.position.x = -300;
  }
//this.sprite.debug=true;
  display(){
    if(!paused){
    let gravity = createVector(0, 0.4 * this.mass);
    this.acceleration.add(p5.Vector.div(gravity, this.mass));


    var groundHeight = 285 - (this.image.height/2);//maybe just get ground object y (duh)

    if(this.position.y > groundHeight){//groundHeight - (this.image/2)){ 215 oeiginally
      this.velocity.y *= 0.9;
      this.position.y = groundHeight;
    }
    //if position inside player position inherit player velocity
    var playerLeft = player.sprite.position.x - (player.image.width + 20);
    var playerRight = player.sprite.position.x + (player.image.width - 20);
    if((this.position.x > playerLeft)&&(this.position.x < playerRight)){

      if(this.position.y > player.sprite.position.y && this.position.y < player.sprite.position.y + player.sprite.height){
        //inside of player 😳😳
        //if(player.inputs[1] > )
        if(player.inputs[1]>20 || player.inputs[1]<-20){
          this.velocity.add(createVector(player.inputs[1]*0.3,-5));//player bashes thru it
        }
        //if on left side push to very left, righ etc
        if(this.position.x < player.sprite.position.x){
          this.position.x = playerLeft;
        } else {
          this.position.x = playerRight;
        }
        
      }
    }
      
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
    this.position.add(this.velocity);
    this.sprite.position = this.position;
    this.velocity.x *= (1-this.drag);
      
    }
    this.sprite.display();
  }
  calculateMovement(){}
  touchFloor(){}
  draw(){
    //hit floor : reduce speed by alot (cap at 0) and inverse?
  }
}
class Player{
  inputs = [0.0,0.0];//UD/LR
  velocity = 0;
  constructor(state){
    this.gameState = state;
    this.sprite = createSprite(200,200);
    this.image = loadImage('img/dog5.png');
    //this.imageL = loadImage('img/rock2.png');
    this.runImage = sprites[1];
    this.crouchImage = sprites[3];
    this.sprite.addImage(loadImage('img/dog5.png'));
    this.dustSprite = createSprite(200,200);
  }
  posx = 0;
  posy = 0;

  capSpeed = 500.0;
  dampening = 0.03;

  touchingGround(){
    return (this.posy >= 285 - (this.sprite.height/2));
  }

  display(){
    var groundHeight = 285 - (this.sprite.height/2);
    //TODO:     
    //dust
    //ghost frames
    //actual game logic :(
    if(this.inputs[1] >= 0){
      this.sprite.mirrorX(1);
    } else {
      this.sprite.mirrorX(-1);
    }

    //start 100 go down to 10
    this.runImage.delay(Math.abs((1/(this.inputs[1]/80)*100)/2) + 1);

    if(!paused){
      this.gameState.inputs = this.inputs;
      this.posx += this.inputs[1];
      this.posy += this.inputs[0];

      if(!this.touchingGround()){
        this.inputs[0] += 1;
      } else {
        this.inputs[1] -= this.inputs[1] * this.dampening;
      }
      

      //console.log(this.inputs[1]);
      //ENABLE ME*******************************
      this.sprite.position.x = this.posx;
      this.sprite.position.y = this.posy;
      //image(props[1],this.posx,this.posy);
      //ENABLE ME*******************************

      if (keyIsDown(UP_ARROW)||keyIsDown(87)) {//AND touching the floor
        //this.posy += 10;
        if(this.touchingGround()){
          this.inputs[0] -= 25 + (this.inputs[1]/200);
        } else {
          if(this.inputs[1] < 10 && this.inputs[1] > -10){
            if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)){
              this.inputs[1]+=2;
            } else if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
              this.inputs[1]-=2;
            }
          }
          
          this.sprite.addImage(this.image);
        }
        //JUMP() CALL
        //this.sprite.position.y += 10;
      } else if(keyIsDown(DOWN_ARROW)||keyIsDown(83)){
        if(!this.touchingGround()){
          this.inputs[0] += 3;
        } /*else {
          //put crouch image
          //add dust
          //slow down
        }*/
        this.sprite.addImage(this.crouchImage);
      } else if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
        if(this.touchingGround()){
          if(this.inputs[1]<-40){
            this.inputs[1] -= 3;
          } else {
            this.inputs[1] -= 1.5;
          }
          this.sprite.addImage(this.runImage);
        }
      } else if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
        if(this.touchingGround()){
          if(this.inputs[1]>40){
            this.inputs[1] += 3;
          } else {
            this.inputs[1] += 1.5;
          }
          this.sprite.addImage(this.runImage);
        }
        
      } else {

        this.sprite.addImage(this.image);
      }
      

      if(keyIsDown(16)&&this.touchingGround()){
        this.inputs[1]*=1.03;
      }
      if(keyIsDown(79)){
        console.log(this.inputs, this.sprite.position.y);//debug :O)
      }
      
      if(this.posy > groundHeight){
        this.posy = groundHeight;
        this.inputs[0] = 0;
      }
      //210-ish floor

    }
    this.sprite.display();
    if(!paused){
      this.inputs[1] = clamp(-this.capSpeed,this.capSpeed)(this.inputs[1]);
    }
// speed arraylist. each if statement adds 1 or -1 to the inputs, but each one caps at 15 or sumthin
// when moving, consider speed then decay it a little (by dampening value)
}
draw(){}
}

class Swarm{

  constructor(posx,posy,count){
    this.posx = posx;
    this.posy = posy;
    this.count = count;
    this.swarmArray = new Array(count);
    for(var i = 0; i < count; i++){
      this.swarmArray[i] = new Bee(this);
    }
  }
  display(){
    if(beeState==2 && !paused){
    this.swarmArray.forEach(o => o.display());

    if(this.posx > player.posx + 50 && this.posx - player.posx < 200){
      this.posx -= 50;
    } else if (this.posx - player.posx > 100){
      this.posx -= 80;
    }
    else if(player.posx - this.posx > 200){
      this.posx += 80;//bee noise sound depend on proximity
    } else {

      this.posx += 50;
    }
  } else {
    this.swarmArray.forEach(o => o.display());
  }
    //ellipse(this.posx, this.posy, 10, 10);
  }
  draw(){}
}

class Bee{
  constructor(swarm){
    this.swarm = swarm;
    var offset = 30 * ((Math.random()*2)-1);
    this.sprite = createSprite(300+offset,300+offset,20,20);//swarm.posx,swarm.posy);
    this.sprite.addImage(npcSprites[0]);
  }
  display(){

    /*

    add check: if too far from swarm origin: reassign position 

    */
   if(!paused){
     var attractionStremgth = (Math.random()*8) + 10
    this.sprite.attractionPoint(attractionStremgth,this.swarm.posx,this.swarm.posy);
    

    if(this.sprite.position.x > this.swarm.posx + 100){
      this.sprite.position.x = this.swarm.posx;
    }
    if(this.sprite.position.y > this.swarm.posy + 100){
      this.sprite.position.y = this.swarm.posy;
    }
    if(this.sprite.position.y < this.swarm.posy -100){
      this.sprite.position.y = this.swarm.posy;
    }
    this.posx = this.sprite.position.x;
    this.posy = this.sprite.position.y;
   }  else {
     this.sprite.position.x = this.posx;
     this.sprite.position.y = this.posy
   }  
    this.sprite.display();
  }
}

/*

DUST HANDLER HERE

to play anim just iterate thru all frames one loop (for x < size())
if player left while right velocity is high (& vice versa)
track player x + width/2

*/

function keyPressed(){
  if(keyCode == 80){
    if(pauseEnabled){
      paused = !paused;
    }
    
  } else if(keyCode == 82){
    readyImgSizeIndex =40;
    beeState = 1;
    gameState.reload();
    releaseButton.remove();
    controlsIntro.remove();
    paused = false;
    //gameState.renderStart();
  }
}

/*

how jump works:
holding adds upwards velocity until 1 second, then cooldown until reset upon under (y var )


*/