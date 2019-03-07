


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
    bozo = new Bozo(gameWidth, gameHeight);

    /* -- HANDLERS -- */
    handlers = { 'thrower': thrower, 'vomit': vomit };
    new InputHandler(handlers);


    // var vomitEffect = new Audio('./audio/themesongedit.mp3');
    score = new Score();
    background = new Background(gameWidth, gameHeight);
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
    requestAnimationFrame(animate);
    setTimeout(1000);
    // console.log("checking function loop") 

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
            if(vomitArray[i] !== undefined){
                vomitArray[i].move();
                vomitArray[i].render();
            }
        }
    
    //console.log(vomitArray);

    
    //from single vomit to array
    if(vomitArray !== undefined){
        for (var i = 0; i < vomitArray.length; i++) {
            
            if (vomitArray[i] !== undefined) {
                if (vomitArray[i].firstRun == true && vomitArray[i].moving == true) {
                    vomitArray[i].firstRun = false;
                    vomitArray[i].align(thrower);
                    vomitArray[i].render();
                }
                //console.log(vomitArray[i].colision(bozo));
                if( vomitArray[i].colision(bozo, canvas) ){
                    
                    delete vomitArray[i];
                    console.log("Colision detected");
                }
               
                
            }
    
    
            //vomitArray[i].coordinates();
        }
    }
    

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
                    vomitArray[len-1].moving = true;
                    
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
    constructor(x,y) {
        x = Math.random() * gameWidth;
        y = Math.random() * gameHeight;
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 173;
        this.image = new Image();
        this.image.src = "assets/Bozo-Head.png";
        this.bozoHits = [
    { name: 'nohits', img: 'Bozo-Vomits/Bozo-Head.png' },
    { name: 'hit-1', img: 'Bozo-Vomits/BV1.png' },
    { name: 'hit-2', img: 'Bozo-Vomits/BV2.png' },
    { name: 'hit-3', img: 'Bozo-Vomits/BV3.png' },
    { name: 'hit-4', img: 'Bozo-Vomits/BV4.png' },
    { name: 'hit-5', img: 'Bozo-Vomits/BV5.png' },
    { name: 'hit-6', img: 'Bozo-Vomits/BV6.png' },
    { name: 'hit-7', img: 'Bozo-Vomits/BV7.png' },
    { name: 'hit-8', img: 'Bozo-Vomits/BV8.png' },
    { name: 'hit-9', img: 'Bozo-Vomits/BV9.png' },
    { name: 'hit-10', img: 'Bozo-Vomits/BV10.png' },
    { name: 'hit-11', img: 'Bozo-Vomits/BV11.png' },
    { name: 'hit-12', img: 'Bozo-Vomits/BV12.png' },
    { name: 'hit-13', img: 'Bozo-Vomits/BV13.png' },
    { name: 'hit-14', img: 'Bozo-Vomits/BV14.png' },
  ];
        
        // Check vertical edges
        if (x >= (gameWidth)) { x = gameWidth - 100; }
        else if (x < (0)) { x = gameWidth + 100; }


        //  Check horizontal edges
        if (y >= (gameHeight)) { y = gameHeight - 100; }
        else if (y < (0)) { y = gameHeight + 100; }
    }
    bozoAnimate(canvas){
        console.log(canvas);
        //this.image = new Image();
        //this.image.src = "assets/Bozo-Vomitz/BV1.png";
        this.draw();
    }
    draw() {
        this.visible = true;
        c.drawImage(this.image, this.x, this.y)

    };

    


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
        this.y += 1;
    }
    align(thrower) {
        this.x = thrower.x + thrower.width / 2 + 25;
    }
    coordinates(){
        console.log(this.x+","+this.y);
    }

    colision(bozo,canvas) {
        
        //console.log(this.x +"-"+ (bozo.x + bozo.width) +" "+ this.x +this.width +"-"+ bozo.x +" -- "+ (this.y +"-"+ bozo.y+bozo.height +" "+ this.y + this.height +"-"+ bozo.y));
        if( this.x < bozo.x + bozo.width && this.x +this.width > bozo.x && this.y < bozo.y+bozo.height && this.y + this.height > bozo.y ) {
            console.log("We vomited on bozo");
            bozo.bozoAnimate(canvas);
            hitCounter++;
            return true;
        }

        if(this.y > gameHeight){
            missedCounter++;
            console.log("The vomit left the scene");
            return true;
        }





        return false;
    }

    draw() {
        c.drawImage(this.image, this.x, this.y)
    };

    reset() {
        
    }

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