/*======CREATE GLOBAL VARIABLES THAT CAN BE ACCESS IN ALL FUNCTIONS=====*/

var gameWidth, gameHeight, canvas, c;
var thrower;
var bozo = [];
var vomit = []

var bozoImg = new Image();

var throwerImg = new Image();

var vomitImg = new Image();



/*======= LOADING RESOURCES ======= */

//Add all objects inside the onload fuction so they will be ready to animate later
window.onload = function () {
    /* -- DEFINING CANVAS -- */
    canvas = document.getElementById("canvas");
    c = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 500;

    gameWidth = canvas.width;
    gameHeight = canvas.height;


    /*-- CREATE THROWER --*/
    thrower = new Thrower(gameWidth, gameHeight)
    new InputHandler(thrower);

    /*-- CREATE BOZO--*/
    bozoImgScale = 150 / 173;
    bozoImg.onload = function () {
        animate();
    }

    bozoImg.src = "./assets/Bozo-Head.png"


    /*-- CREATE VOMIT --*/
    vomitImgScale = 0.5;
    vomitImg.onload = function () {
        animate();
    }

    vomitImg.src = "./assets/vomit.png"

}

/*====== THROW UPPER OBJECT =====*/
class Thrower {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.width = 150;
        this.height = 150;
        this.maxSpeed = 7;
        this.speed = 0;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - this.height - 10;
        this.image = new Image(this.width * (300 / 316), this.height)
        this.image.src = "./assets/open-mouth-smaller.png";
        this.image.onload = animate
    }
    moveLeft() {
        this.speed = -this.maxSpeed;
    }
    moveRight() {
        this.speed = this.maxSpeed;
    }
    stop() {
        this.speed = 0;
    }
    draw() {
        c.drawImage(this.image, this.x, this.y)
    };
    update(dt) {
        if (!dt) return;
        this.x += this.speed;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
    }
}



/*====== ANIMATE THROWUPER =====*/
let lastTime = 0;

function animate(timestamp) {
    //bozoImg.onload
    let dt = timestamp - lastTime;
    lastTime = timestamp
    requestAnimationFrame(animate)
    // console.log("checking function loop") 

    // clear canvas each time you draw on top of it. Otherwise the circle will look like a continuous line
    c.clearRect(0, 0, gameWidth, gameHeight);


    // updates the thrower to it's new position 
    thrower.update(dt);


    /*======DRAW IMAGES! =====*/
    // call the thrower.draw() method inside the animate function so it does not get affected when we clear the browser at each loop.
    //draws the thrower again at the new position

    thrower.draw();
    c.drawImage(bozoImg, 200, 200, 150 * bozoImgScale, 150);
    c.drawImage(vomitImg, 100, 100, 150 * vomitImgScale, 150 * vomitImgScale);

}


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
