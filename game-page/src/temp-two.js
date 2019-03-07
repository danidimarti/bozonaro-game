


/*======CREATE GLOBAL VARIABLES THAT CAN BE ACCESS IN ALL FUNCTIONS=====*/

var gameWidth = document.innerWidth, gameHeight = document.innerHeight, canvas, c;
var thrower;
var vomitArray = [];
var hitCounter = 0;
var missedCounter = 0;





/*======= LOADING RESOURCES ======= */

//Add all objects inside the onload fuction so they will be ready to animate later
window.onload = function () {
    /* -- DEFINE CANVAS -- */
    canvas = document.getElementById("canvas");
    c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    gameWidth = canvas.width;
    gameHeight = canvas.height;

    /*-- CREATE NEW OBJECTS --*/

    thrower = new Thrower(gameWidth, gameHeight)
    vomit = new Vomit(gameWidth, gameHeight);
    bozo = new Bozo();
    score = new Score();
    background = new Background(gameWidth, gameHeight);


    /* -- HANDLERS -- */
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
        this.image.src = "./assets/open-mouth-person-3.png";
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
        c.drawImage(this.image, this.x, this.y);
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
    let dt = timestamp - lastTime;
    lastTime = timestamp;

    // clear canvas each time you draw on top of it. Otherwise the circle will look like a continuous line
    c.clearRect(0, 0, gameWidth, gameHeight);
    background.draw()

    /*======DRAW IMAGES =====*/
    // updates the thrower to it's new position 
    thrower.update(dt);

    /*======DRAW IMAGES! =====*/
    // call the thrower.draw() method inside the animate function so it does not get affected when we clear the browser at each loop.
    //draws the thrower again at the new position
    thrower.draw();
    bozo.draw();
    score.draw()

    //Process Vomit Array
    for (var i = 0; i < vomitArray.length; i++) {
        if (vomitArray[i] !== undefined) {
            vomitArray[i].move();
            vomitArray[i].render();
        }
    }

    //from single vomit to array
    if (vomitArray !== undefined) {
        for (var i = 0; i < vomitArray.length; i++) {

            if (vomitArray[i] !== undefined) {
                if (vomitArray[i].firstRun == true && vomitArray[i].moving == true) {
                    vomitArray[i].firstRun = false;
                    vomitArray[i].align(thrower);
                    vomitArray[i].render();
                }
                //console.log(vomitArray[i].colision(bozo));

                if (vomitArray[i].colision(bozo, canvas)) {

                    delete vomitArray[i];
                    console.log("Colision detected");
                }


            }

        }
    }

    if (bozo.endGame == false) {
        requestAnimationFrame(animate);
    } else {
        c.clearRect(0, 0, gameWidth, gameHeight);
        endAnimation(timestamp);
    }

    if (Math.floor(lastTime) % 151 == 0) {
        bozo.randomizeLocation();
    }
    if (missedCounter == 3) {
        c.clearRect(0, 0, gameWidth, gameHeight);
        loseAnimation(timestamp);
    }

}

function endAnimation(timestamp) {
    bozo.degrees++
    if (bozo.degrees == 360) { degrees = 0 }
    c.clearRect(0, 0, gameWidth, gameHeight);

    bozo.rotate(bozo.degrees);
    
}

function loseAnimation(timestamp) {
    c.clearRect(0, 0, gameWidth, gameHeight);
    background.draw()
    bozo.rotate();
}

/*======MOVE OBJECT WITH ARROW KEYS =====*/
//Create event listener based on KeyCode number of arrows left and right.
class InputHandler {
    constructor(handlers) {
        document.addEventListener("keydown", event => {
            // alert(event.keyCode) - checking the keyCode numbers of arrow keys.
            switch (event.keyCode) {
                case 37:
                    handlers.thrower.moveLeft();
                    break;
                case 39:
                    handlers.thrower.moveRight();
                    break;
                case 32:
                    vomitArray.push(new Vomit(canvas.width, thrower.x));
                    var len = vomitArray.length;
                    //console.log(len);
                    vomitArray[len - 1].moving = true;

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
                    if (vomit.height == gameHeight)
                        vomit.stop();
                    break;

            }
        });

    }
}

class Bozo {
    constructor() {
        this.x = Math.random() * gameWidth;
        this.y = Math.random() * gameHeight;
        this.width = 150;
        this.height = 173;
        this.image = new Image();
        this.animStage = 0;
        this.animLength = 14;
        this.endGame = false;
        this.degrees = 0;
        this.image.src = 'assets/Bozo-Vomits/BV0.png';
        this.validateLocation();


    }

    validateLocation() {
        // Check vertical edges
        if (this.x + this.width >= (gameWidth)) { this.x = gameWidth - this.width; }
        else if (this.x + this.width < (0)) { this.x = gameWidth + this.width; }


        //  Check horizontal edges
        if (this.y + this.height >= (gameHeight)) { this.y = gameHeight - this.height; }
        else if (this.y + this.height < (0)) { this.y = gameHeight + this.height; }

        if (this.y < 200) {
            this.y += 200;
        }
    }

    bozoAnimate(canvas) {
        //console.log(canvas);

        this.animStage++;
        if (this.animStage < this.animLength) {
            this.image = new Image();
            this.image.src = "assets/Bozo-Vomits/BV" + this.animStage + ".png";
            this.x = Math.random() * gameWidth;
            this.y = Math.random() * gameHeight;
            this.validateLocation();

        } else {
            this.endGame = true;
        }

    }
    draw() {
        c.drawImage(this.image, this.x, this.y);
    };

    rotate(degrees) {

        c.clearRect(0, 0, gameWidth, gameHeight);

        background.draw()
        this.youWin()
        c.save();
        // this.x = gameWidth / 2 - this.width;
        // this.y = gameHeight / 2 - this.height;
        c.translate(gameWidth / 2, gameHeight / 2);
        c.rotate(degrees * Math.PI / 180);

        this.image = new Image();
        // this.image.style.width = "200%";
        // this.image.style.height = "200%";
        this.image.src = "assets/Bozo-Vomits/BV14.png";
        c.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.width, this.height);

        c.restore()

    };

    youWin() {
        c.fillStyle = "red";
        c.font = "60px Cuprum";
        c.textAlign = "center";
        c.textBaseline = "bottom";
        c.fillText("YOU WIN!", gameWidth / 2, 200);

    }

    youLose() {
        c.fillStyle = "red";
        c.font = "60px Cuprum";
        c.textAlign = "center";
        c.textBaseline = "bottom";
        c.fillText("YOU LOSE!", gameWidth / 2, 200);
    }
    loseFace() {

        c.clearRect(0, 0, gameWidth, gameHeight);

        background.draw()
        this.lose()
        // c.save();
        // c.translate(gameWidth / 2, gameHeight / 2);
        // c.rotate(degrees * Math.PI / 180);

        this.image = new Image();
        this.image.src = "assets/Bozo-Vomits/BV14.png";
        c.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.width, this.height);

        // c.restore()

    };

    randomizeLocation() {
        this.image = new Image();
        this.image.src = "assets/Bozo-Vomits/BV" + this.animStage + ".png";
        this.x = Math.random() * gameWidth;
        this.y = Math.random() * gameHeight;
        this.validateLocation();
    }



};


class Vomit {
    constructor(gameWidth, x) {
        this.gameWidth = gameWidth;
        this.width = 40;
        this.height = 58;
        this.firstRun = true;
        this.moving = false;
        this.speed = 0;
        this.x = x + 60;
        this.y = 60;
        this.image = new Image();
        this.image.src = "assets/vomit-smaller.png";


    }
    move() {
        this.y += 5;
    }
    align(thrower) {
        this.x = thrower.x + thrower.width / 2 + 25;
    }
    coordinates() {
        console.log(this.x + "," + this.y);
    }

    colision(bozo, canvas) {

        //console.log(this.x +"-"+ (bozo.x + bozo.width) +" "+ this.x +this.width +"-"+ bozo.x +" -- "+ (this.y +"-"+ bozo.y+bozo.height +" "+ this.y + this.height +"-"+ bozo.y));
        if (this.x < bozo.x + bozo.width && this.x + this.width > bozo.x && this.y < bozo.y + bozo.height && this.y + this.height > bozo.y) {
            bozo.bozoAnimate(canvas);
            hitCounter++;
            return true;
        }

        if (this.y > gameHeight) {
            missedCounter++;
            return true;
        }

        return false;
    }

    draw() {
        c.drawImage(this.image, this.x, this.y)
    };

    render() {
        this.move();
        this.draw();
    }
}


class Background {
    constructor(gameWidth, gameHeight) {
        this.width = gameWidth;
        this.height = gameHeight;
        this.speed = 0.2;
        this.x = 0;
        this.y = 0;
        this.image = new Image()
        this.image.src = "assets/bg-star-2.jpg";
        this.image.onload = animate;

    }

    draw() {
        this.y += this.speed;
        c.drawImage(this.image, this.x, this.y)
        if (this.y >= gameHeight) {
            this.y = 0;
        }
        // Draw another image at the top edge of the first image
        c.drawImage(this.image, this.x, this.y - gameHeight);
    };

    reset() {
        this.speed = 0;
    }

}

class Score {
    constructor(x, y) {
        this.x = gameWidth;
        this.y = gameHeight;

    }

    draw() {
        c.fillStyle = "white";
        c.font = "24px Helvetica";
        c.textAlign = "left";
        c.textBaseline = "top";
        c.fillText("Hits: " + hitCounter, 50, gameHeight - 100);
        c.fillText("Missed: " + missedCounter + "/3", 50, gameHeight - 60);

    }
}