window.onload = function () {}

/*======DEFINING CANVAS =====*/
var canvas = document.getElementById("mycanvas");
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gameWidth = canvas.width;
var gameHeight = canvas.height;


/*====== LOAD BOZO IMAGE =====*/

var bozoImg = {
    onload: function () {
        drawImage(bozoImg, 0, 0)
    },
    src: 'assets/bg.png',
}

var bozo = new Image();

/*====== THROW UPPER OBJECT =====*/
class Thrower {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.width = 300;
        this.height = 50;

        //creating the speed of the arrow movement
        this.maxSpeed = 7;
        this.speed = 0

        //initial position on the middle of the canvas

        this.x = gameWidth / 2 - this.width / 2;
        this.y = 10;

    }

    //when moving left, the current speed will be the same as the max speed 10pixels/second, but negative because is going on the oposite side of the initial position
    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    draw(c) {
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    // we want to change the rect 5 pixels/sec 
    //dt = the difference in time between two frames. 
    update(dt) {
        if (!dt) return;
        //the updated position will be the speed which is the same as the current position of the object.

        //making sure the thrower stops at end of the canvas.
        this.x += this.speed;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
    }
}

/*====== CREATE AND DRAW THROWUPER =====*/
let thrower = new Thrower(gameWidth, gameHeight)

thrower.draw(c);



/*====== ANIMATE THROWUPER =====*/
let lastTime = 0;

function animate(timestamp) {
    let dt = timestamp - lastTime;
    lastTime = timestamp
    requestAnimationFrame(animate)
    // console.log("checking function loop") 

    // clear canvas each time you draw on top of it. Otherwise the circle will look like a continuous line
    c.clearRect(0, 0, gameWidth, gameHeight);

    // updates the thrower to it's new position 
    thrower.update(dt);

    // call the thrower.draw() method inside the animate function so it does not get affected when we clear the browser at each loop.
    //draws the thrower again at the new position
    thrower.draw(c);

}

animate();


/*======MOVE OBJECT WITH ARROW KEYS =====*/

//Create event listener based on KeyCode number of arrows left and right.
class InputHandler {

    constructor(thrower) {
        document.addEventListener("keydown", event => {
            // alert(event.keyCode) - checking the keyCode numbers of arrow keys.
            switch (event.keyCode) {
                case 37:
                    thrower.moveLeft();
                    break;
                case 39:
                    thrower.moveRight();
                    break;
            }
        });

        //stop the movement when key is released
        document.addEventListener("keyup", event => {

            switch (event.keyCode) {
                case 37:
                    //make the direction change smoother
                    if (thrower.speed < 0)
                        thrower.stop();
                    break;
                case 39:
                    if (thrower.speed > 0)
                        thrower.stop();
                    break;
            }
        });

    }
}

new InputHandler(thrower);






/*====== ANIMATE BOZO  =====*/
class Bozo {



    update() {
        //TODO
    }

}
