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

eval("const {\n  movementController\n} = __webpack_require__(/*! ./gameUtil.js */ \"./client/src/gameUtil.js\"); // import movementController from './gameUtil.js';\n\n\nvar config = {\n  type: Phaser.AUTO,\n  // Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO (auto will try WebGL, but will fall to canvas if necessary)\n  width: 800,\n  height: 600,\n  physics: {\n    default: 'arcade',\n    arcade: {\n      gravity: {\n        y: 300\n      },\n      debug: false\n    }\n  },\n  scene: {\n    preload: preload,\n    create: create,\n    update: update\n  }\n};\n\nfunction loadImages(context) {\n  // First param is a key related to this image asset. Second is a path to the asset itself\n  // NOTE: the assets routing is served by the server, pointing to the assets folder at root\n  // NOTE 2: this is usually directly in the preload function. I abstracted it and set context to 'this'\n  context.load.image('sky', 'assets/sky.png');\n  context.load.image('ground', 'assets/platform.png');\n  context.load.image('star', 'assets/star.png');\n  context.load.image('bomb', 'assets/bomb.png');\n  context.load.spritesheet('dude', 'assets/dude.png', {\n    frameWidth: 32,\n    frameHeight: 48\n  });\n}\n\nfunction createPlatforms(platforms) {\n  /**\n   * Create an object at the specified location (coords are based on middle of object)\n   * The setScale will adjust the overall size of the object, and refresh body will\n   * refresh the collisions and such to the new scale.\n   */\n  platforms.create(400, 568, 'ground').setScale(2).refreshBody();\n  platforms.create(600, 400, 'ground');\n  platforms.create(50, 250, 'ground');\n  platforms.create(750, 220, 'ground');\n}\n\nfunction addCollidersAndOverlaps(context, objects) {\n  /**\n   * ===== this.physics.add.collision && this.physics.add.overlap\n   * 1 & 2. Objects to compare to see if they collide/overlap\n   * 3. An optional callback function (cbA) that is called when they collide/overlap\n   * 4. An optional callback function (cbB) that lets you perform additional checks against\n   *    the two objects if they collide/overlap. If this is set, then cbA will only fire\n   *    if cbB returns true\n   * 5. The context in which to run the callbacks (usually 'this')\n   * NOTE: Collisions will not let items pass through each other, but overlap will\n   */\n  context.physics.add.collider(objects.player, objects.platforms);\n}\n\nvar game = new Phaser.Game(config);\nvar score = 0;\nvar scoreText;\n\nfunction preload() {\n  loadImages(this);\n}\n\nfunction create() {\n  //\n  this.socket = io();\n  this.socket.on('message', text => {\n    console.log(text);\n  }); // this.socket.emit('message', 'I joined!');\n  // ===== Add the background and score text to the game\n\n  this.add.image(400, 300, 'sky'); // ===== Add the player object to the game\n\n  player = this.physics.add.sprite(100, 450, 'dude'); // Set the player's \"bouncyness\"\n\n  player.setBounce(0.2); // Don't let the player walk outside of the screen borders\n\n  player.setCollideWorldBounds(true); // ===== Add platforms to the game\n  // Static objects are fixed and can't move in the world.\n  // However, they may move relative to a camera (maybe)\n\n  platforms = this.physics.add.staticGroup();\n  createPlatforms(platforms); // ===== Set colliders and overlaps\n  // (I made a helper function for this step)\n\n  addCollidersAndOverlaps(this, {\n    player,\n    platforms\n  }); // ===== Set the player animations\n  // (I made a helper function for this step)\n\n  setAnimations(this); // Set up the keyboard tracking for cursor keys\n\n  cursors = this.input.keyboard.createCursorKeys();\n}\n\nfunction update() {\n  movementController(cursors, player);\n}\n\nfunction setAnimations(context) {\n  context.anims.create({\n    key: 'left',\n    frames: context.anims.generateFrameNumbers('dude', {\n      start: 0,\n      end: 3\n    }),\n    frameRate: 10,\n    repeat: -1\n  });\n  context.anims.create({\n    key: 'turn',\n    frames: [{\n      key: 'dude',\n      frame: 4\n    }],\n    frameRate: 20\n  });\n  context.anims.create({\n    key: 'right',\n    frames: context.anims.generateFrameNumbers('dude', {\n      start: 5,\n      end: 8\n    }),\n    frameRate: 10,\n    repeat: -1\n  });\n}\n\n//# sourceURL=webpack://socialite.io/./client/src/game.js?");

/***/ }),

/***/ "./client/src/gameUtil.js":
/*!********************************!*\
  !*** ./client/src/gameUtil.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\nif (!module || !module.exports) {\n  module.exports = {};\n}\n\nconst movementController = function (cursors, player) {\n  if (cursors.left.isDown) {\n    player.setVelocityX(-160);\n    player.anims.play('left', true);\n  } else if (cursors.right.isDown) {\n    player.setVelocityX(160);\n    player.anims.play('right', true);\n  } else {\n    player.setVelocityX(0);\n    player.anims.play('turn');\n  }\n\n  if (cursors.up.isDown && player.body.touching.down) {\n    player.setVelocityY(-330);\n  }\n};\n\nmodule.exports = {\n  movementController\n};\n\n//# sourceURL=webpack://socialite.io/./client/src/gameUtil.js?");

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