const { movementController } = require('./gameUtil.js');
// import movementController from './gameUtil.js';

var config = {
  type: Phaser.AUTO, // Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO (auto will try WebGL, but will fall to canvas if necessary)
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var players = [];

function loadImages(context) {
  context.load.image('sky', 'assets/sky.png');
  context.load.image('ground', 'assets/platform.png');
  context.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

function createPlatforms(platforms) {
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
}

function addCollidersAndOverlaps(context, objects) {
  context.physics.add.collider(objects.player, objects.platforms);
}

function playersInitialization(context, players) {
  for (let [key, position] of Object.entries(context.players)) {
    if (key !== context.socket.id) {
      addPlayer(context, {position, id: key});
    }
  }
}

function addPlayer(context, playerInfo) {
  var newPlayer = context.physics.add.sprite(playerInfo.position.x, playerInfo.position.y, 'dude');
  newPlayer.playerId = playerInfo.id;
  newPlayer.setBounce(0.2);
  newPlayer.setCollideWorldBounds(true);
  newPlayer.anims.play('turn');
  players.push(newPlayer);
}

function setPlayerPositions(context) {
  for (let [key, position] of Object.entries(context.players)) {
    if (key !== context.socket.id) {
      console.log(key, position);
    }
  }
}

var game = new Phaser.Game(config);
var score = 0;
var scoreText;

function preload () {
  loadImages(this);
}

function create () {
  //
  // ===== Add the background and score text to the game
  this.add.image(400, 300, 'sky');

  this.players = {};

  this.socket = io();

  this.socket.on('message', text => {
    console.log(text);
  });

  this.socket.on('init', data => {
    console.log('init', data);
    playersInitialization(this, data);
  });

  this.socket.on('playersData', data => {
    this.players = data;
    setPlayerPositions(this);
  });

  this.socket.on('newPlayer', playerData => {
    addPlayer(this, playerData);
  })

  // ===== Add the player object to the game
  player = this.physics.add.sprite(400, 300, 'dude');
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
  movementController(cursors, player, this.socket);
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

