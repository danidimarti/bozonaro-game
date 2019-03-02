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

    canvas.width = innerWidth * 0.8;
    canvas.height = innerHeight * 0.8;

    gameWidth = canvas.width;
    gameHeight = canvas.height;


    /*-- CREATE THROWER --*/
    thrower = new Thrower(gameWidth, gameHeight)
    vomit = new Vomit(gameWidth, gameHeight)
    bozo = new Bozo(gameWidth, gameHeight)

    handlers = { 'thrower': thrower, 'vomit': vomit };
    new InputHandler(handlers);



}

/*====== THROW UPPER OBJECT =====*/
class Thrower {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.width = 80;
        this.height = 80;
        this.maxSpeed = 7;
        this.speed = 0;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = this.height - 150;
        this.image = new Image(this.width, this.height)
        this.image.src = "./assets/open-mouth-person.png";
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
    // call draw() method inside the animate function so it does not get affected when we clear the browser at each loop.
    //draws elements again at the new position

    thrower.draw();
    
    if (vomit.moving) { 
        // handlers.vomit.moving = false;
        
        if (vomit.firstRun == true && vomit.moving == true) {
            vomit.firstRun == false;
            vomit.align(thrower);
            
        //    debugger
        }
        // debugger
        vomit.show();
        
        
    }
       
    
    

    bozo.draw()

}


/*======MOVE OBJECT WITH ARROW KEYS =====*/
//Create event listener based on KeyCode number of arrows left and right.
class InputHandler {
    constructor(handlers) {
        document.addEventListener("keydown", event => {
            // alert(event.keyCode) - checking the keyCode numbers of arrow keys.
            switch (event.keyCode) {
                case 37:
                    handlers['thrower'].moveLeft();
                    break;
                case 39:
                    handlers['thrower'].moveRight();
                    break;
                case 32:
                    handlers.vomit.moving = true;
                    
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
                case 32:

                    break;

            }
        });

    }
}

class Bozo {
    constructor(gameWidth, gameHeight) {
        this.x = Math.random() * gameWidth;
        this.y = Math.random() * gameHeight;
        this.image = new Image()
        this.image.src = "assets/Bozo-Head.png";
        this.image.onload = animate
    }

    draw() {
        c.drawImage(this.image, this.x, this.y)
    };

    onHit = function () {
        this.visible = false;
    }

}

class Vomit {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.width = 0;
        this.height = 80;
        this.firstRun = false;
        this.moving = false;
        this.speed = 0;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = this.height - 10;
        this.image = new Image()
        this.image.src = "assets/vomit-smaller.png";
        this.image.onload = animate
    }
    move() {
        this.y = this.y + 5;
    }
    align(thrower) {

        this.x = thrower.x + thrower.width / 2 + 16;
    }
    colision(bozo) {
        if (bozo.x == this.x || bozo.y == this.y) {
            bozo.onHit;
        }
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
    show() {
        this.move();
        this.draw();
        setTimeout(function(){ handlers.vomit.moving = false }, 500); 
    }
}

