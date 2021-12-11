if (!module || !module.exports) {
  module.exports = {};
}

const movementController = function (cursors, player, io) {
  function communicate() {
    io.emit('movement', {
      x: player.x,
      y: player.y
    });
  }
  if (cursors.left.isDown && cursors.right.isDown) {
    player.setVelocityX(0);
    player.anims.play('turn');
  } else if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
    communicate();
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
    communicate();
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && cursors.down.isDown) {
    player.setVelocityY(0);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-160);
    communicate();
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    communicate();
  } else {
    player.setVelocityY(0);
  }
}

module.exports = {
  movementController
};