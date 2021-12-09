const { movementController } = require('./gameUtil.js');
// import movementController from './gameUtil.js';

var config = {
  type: Phaser.AUTO, // Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO (auto will try WebGL, but will fall to canvas if necessary)
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

function loadImages(context) {
  // First param is a key related to this image asset. Second is a path to the asset itself
  // NOTE: the assets routing is served by the server, pointing to the assets folder at root
  // NOTE 2: this is usually directly in the preload function. I abstracted it and set context to 'this'
  context.load.image('sky', 'assets/sky.png');
  context.load.image('ground', 'assets/platform.png');
  context.load.image('star', 'assets/star.png');
  context.load.image('bomb', 'assets/bomb.png');
  context.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

function createPlatforms(platforms) {
  /**
   * Create an object at the specified location (coords are based on middle of object)
   * The setScale will adjust the overall size of the object, and refresh body will
   * refresh the collisions and such to the new scale.
   */
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
}

function addCollidersAndOverlaps(context, objects) {
  /**
   * ===== this.physics.add.collision && this.physics.add.overlap
   * 1 & 2. Objects to compare to see if they collide/overlap
   * 3. An optional callback function (cbA) that is called when they collide/overlap
   * 4. An optional callback function (cbB) that lets you perform additional checks against
   *    the two objects if they collide/overlap. If this is set, then cbA will only fire
   *    if cbB returns true
   * 5. The context in which to run the callbacks (usually 'this')
   * NOTE: Collisions will not let items pass through each other, but overlap will
   */
  context.physics.add.collider(objects.player, objects.platforms);
}

var game = new Phaser.Game(config);
var score = 0;
var scoreText;

function preload () {
  loadImages(this);
}

function create () {
  //
  this.socket = io();

  this.socket.on('message', text => {
    console.log(text);
  });

  // this.socket.emit('message', 'I joined!');

  // ===== Add the background and score text to the game
  this.add.image(400, 300, 'sky');


  // ===== Add the player object to the game
  player = this.physics.add.sprite(100, 450, 'dude');
  // Set the player's "bouncyness"
  player.setBounce(0.2);
  // Don't let the player walk outside of the screen borders
  player.setCollideWorldBounds(true);


  // ===== Add platforms to the game
  // Static objects are fixed and can't move in the world.
  // However, they may move relative to a camera (maybe)
  platforms = this.physics.add.staticGroup();
  createPlatforms(platforms);

  // ===== Set colliders and overlaps
  // (I made a helper function for this step)
  addCollidersAndOverlaps(this, {
    player, platforms
  });


  // ===== Set the player animations
  // (I made a helper function for this step)
  setAnimations(this);


  // Set up the keyboard tracking for cursor keys
  cursors = this.input.keyboard.createCursorKeys();
}

function update () {
  movementController(cursors, player);
}

function setAnimations(context) {
  context.anims.create({
    key: 'left',
    frames: context.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  context.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  context.anims.create({
    key: 'right',
    frames: context.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}

