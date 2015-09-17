var CANVAS_W = 505,
    CANVAS_H = 606,
    TILE_W = 101,
    TILE_H = 83,

    // tiles have some empty space that we must compensate for...
    ENEMY_H_OFFSET = 78,
    PLAYER_H_OFFSET = 60,
    CANVAS_H_OFFSET = 57;

// Enemies our player must avoid
var Enemy = function(speed, x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.w = getRandomInt(CANVAS_W, 2*CANVAS_W);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x >= this.w) this.x = -TILE_W;
    if (this.checkCollision(player)) {
        restart();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 0, ENEMY_H_OFFSET, TILE_W, TILE_H, this.x, this.y, TILE_W, TILE_H);
};

Enemy.prototype.checkCollision = function (item) {
    var topLeft = {x: this.x, y:this.y},
        bottomRight = {x: this.x + TILE_W, y: this.y + TILE_H};
    var margin = 20;
    var corners = [
        {x: item.x + margin, y: item.y + margin},
        {x: item.x + TILE_W - margin, y: item.y + margin},
        {x: item.x + margin, y: item.y + TILE_H - margin},
        {x: item.x + TILE_W - margin, y: item.y + TILE_H - margin}
    ];

    return corners.some(function (point) {
        return point.x > topLeft.x && point.x < bottomRight.x
            && point.y > topLeft.y && point.y < bottomRight.y;
    });
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.speed = 100;
    this.direction = null;
    this.x = this.initialPosition[0];
    this.y = this.initialPosition[1];
};

Player.prototype.update = function(dt) {
    if (this.direction == 'left') {
        this.x -= this.speed*dt;
    } else if (this.direction == 'right') {
        this.x += this.speed*dt;
    } else if (this.direction == 'up') {
        this.y -= this.speed*dt;
    } else if (this.direction == 'down') {
        this.y += this.speed*dt;
    }

    //limit x movement
    if (this.x <= 0) this.x = 0;
    else if (this.x >= CANVAS_W - TILE_W) this.x = CANVAS_W - TILE_W;

    //limit y movement
    if (this.y <= CANVAS_H_OFFSET) {
        incrementLevel();
    } else if (this.y >= this.initialPosition[1]) {
        this.y = this.initialPosition[1];
    }
};

Player.prototype.initialPosition = [CANVAS_W/2 - TILE_W/2, CANVAS_H_OFFSET + TILE_H*5];

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 0, PLAYER_H_OFFSET, TILE_W, TILE_H, this.x, this.y, TILE_W, TILE_H);
};

Player.prototype.handleInput = function (direction) {
    this.direction = direction;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
var level = 0;

function initEnemies() {
    for (var i = 1; i <= 3; i++) {
        addEnemy();
    }
}

function addEnemy() {
    allEnemies.push(new Enemy(
        getRandomInt(20, 80),
        -TILE_W,
        CANVAS_H_OFFSET + TILE_H*getRandomInt(1,4)
    ));
}

function incrementLevel() {
    level++;
    player.y = player.initialPosition[1];
    if (allEnemies.length < 10) {
        addEnemy();
    } else {
        allEnemies.forEach(function (enemy) {
            enemy.speed += 5;
        });
    }
    player.speed += 5;
}

function restart() {
    Player.call(player);
    allEnemies = [];
    level = 0;
    initEnemies();
}

initEnemies();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
