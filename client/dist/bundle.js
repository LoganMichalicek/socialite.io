/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/game.js":
/*!****************************!*\
  !*** ./client/src/game.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  movementController\n} = __webpack_require__(/*! ./gameUtil.js */ \"./client/src/gameUtil.js\"); // import movementController from './gameUtil.js';\n\n\nvar config = {\n  type: Phaser.AUTO,\n  // Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO (auto will try WebGL, but will fall to canvas if necessary)\n  width: 800,\n  height: 600,\n  physics: {\n    default: 'arcade',\n    arcade: {\n      gravity: {\n        y: 0\n      },\n      debug: false\n    }\n  },\n  scene: {\n    preload: preload,\n    create: create,\n    update: update\n  }\n};\nvar players = [];\n\nfunction loadImages(context) {\n  context.load.image('sky', 'assets/sky.png');\n  context.load.image('ground', 'assets/platform.png');\n  context.load.spritesheet('dude', 'assets/dude.png', {\n    frameWidth: 32,\n    frameHeight: 48\n  });\n}\n\nfunction createPlatforms(platforms) {\n  platforms.create(400, 568, 'ground').setScale(2).refreshBody();\n  platforms.create(600, 400, 'ground');\n  platforms.create(50, 250, 'ground');\n  platforms.create(750, 220, 'ground');\n}\n\nfunction addCollidersAndOverlaps(context, objects) {\n  context.physics.add.collider(objects.player, objects.platforms);\n}\n\nfunction playersInitialization(context, players) {\n  for (let [key, position] of Object.entries(context.players)) {\n    if (key !== context.socket.id) {\n      addPlayer(context, {\n        position,\n        id: key\n      });\n    }\n  }\n}\n\nfunction addPlayer(context, playerInfo) {\n  var newPlayer = context.physics.add.sprite(playerInfo.position.x, playerInfo.position.y, 'dude');\n  newPlayer.playerId = playerInfo.id;\n  newPlayer.setBounce(0.2);\n  newPlayer.setCollideWorldBounds(true);\n  newPlayer.anims.play('turn');\n  players.push(newPlayer);\n}\n\nfunction setPlayerPositions(context) {\n  for (let [key, position] of Object.entries(context.players)) {\n    if (key !== context.socket.id) {\n      let player = players.filter(player => player.playerId === key)[0];\n\n      if (player) {\n        player.x = position.x;\n        player.y = position.y;\n      }\n    }\n  }\n}\n\nvar game = new Phaser.Game(config);\nvar score = 0;\nvar scoreText;\n\nfunction preload() {\n  loadImages(this);\n}\n\nfunction create() {\n  //\n  // ===== Add the background and score text to the game\n  this.add.image(400, 300, 'sky');\n  this.players = {};\n  this.socket = io();\n  this.socket.on('message', text => {\n    console.log(text);\n  });\n  this.socket.on('init', data => {\n    console.log('init', data);\n    playersInitialization(this, data);\n  });\n  this.socket.on('playersData', data => {\n    this.players = data;\n    setPlayerPositions(this);\n  });\n  this.socket.on('newPlayer', playerData => {\n    addPlayer(this, playerData);\n  });\n  this.socket.on('playerLeft', id => {\n    console.log('Player left!:', id);\n    delete this.players[id];\n    console.log('Player objects:', players);\n    delete players.filter(player => player.playerId === id);\n    console.log('New player objects:', players);\n  }); // ===== Add the player object to the game\n\n  player = this.physics.add.sprite(400, 300, 'dude'); // Set the player's \"bouncyness\"\n\n  player.setBounce(0.2); // Don't let the player walk outside of the screen borders\n\n  player.setCollideWorldBounds(true); // ===== Add platforms to the game\n  // Static objects are fixed and can't move in the world.\n  // However, they may move relative to a camera (maybe)\n\n  platforms = this.physics.add.staticGroup();\n  createPlatforms(platforms); // ===== Set colliders and overlaps\n  // (I made a helper function for this step)\n\n  addCollidersAndOverlaps(this, {\n    player,\n    platforms\n  }); // ===== Set the player animations\n  // (I made a helper function for this step)\n\n  setAnimations(this); // Set up the keyboard tracking for cursor keys\n\n  cursors = this.input.keyboard.createCursorKeys();\n}\n\nfunction update() {\n  movementController(cursors, player, this.socket);\n}\n\nfunction setAnimations(context) {\n  context.anims.create({\n    key: 'left',\n    frames: context.anims.generateFrameNumbers('dude', {\n      start: 0,\n      end: 3\n    }),\n    frameRate: 10,\n    repeat: -1\n  });\n  context.anims.create({\n    key: 'turn',\n    frames: [{\n      key: 'dude',\n      frame: 4\n    }],\n    frameRate: 20\n  });\n  context.anims.create({\n    key: 'right',\n    frames: context.anims.generateFrameNumbers('dude', {\n      start: 5,\n      end: 8\n    }),\n    frameRate: 10,\n    repeat: -1\n  });\n}\n\n//# sourceURL=webpack://socialite.io/./client/src/game.js?");

/***/ }),

/***/ "./client/src/gameUtil.js":
/*!********************************!*\
  !*** ./client/src/gameUtil.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\nif (!module || !module.exports) {\n  module.exports = {};\n}\n\nconst movementController = function (cursors, player, io) {\n  function communicate() {\n    io.emit('movement', {\n      x: player.x,\n      y: player.y\n    });\n  }\n\n  if (cursors.left.isDown && cursors.right.isDown) {\n    player.setVelocityX(0);\n    player.anims.play('turn');\n  } else if (cursors.left.isDown) {\n    player.setVelocityX(-160);\n    player.anims.play('left', true);\n    communicate();\n  } else if (cursors.right.isDown) {\n    player.setVelocityX(160);\n    player.anims.play('right', true);\n    communicate();\n  } else {\n    player.setVelocityX(0);\n    player.anims.play('turn');\n  }\n\n  if (cursors.up.isDown && cursors.down.isDown) {\n    player.setVelocityY(0);\n  } else if (cursors.up.isDown) {\n    player.setVelocityY(-160);\n    communicate();\n  } else if (cursors.down.isDown) {\n    player.setVelocityY(160);\n    communicate();\n  } else {\n    player.setVelocityY(0);\n  }\n};\n\nmodule.exports = {\n  movementController\n};\n\n//# sourceURL=webpack://socialite.io/./client/src/gameUtil.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/src/game.js");
/******/ 	
/******/ })()
;