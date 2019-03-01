/*======CREATE GLOBAL VARIABLES THAT CAN BE ACCESS IN ALL FUNCTIONS=====*/

var gameWidth, gameHeight, canvas, c, bozo, bozo;

var bozoImg = new Image();

var bozoImg = new Image();

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
    

}

/*====== THROW UPPER OBJECT =====*/
class Bozo {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.width = 150;
        this.height = 50;

        //creating the speed of the arrow movement
        this.maxSpeed = 7;
        this.speed = 0;

        //initial position on the middle of the canvas 
        this.x = gameWidth / 2 - this.width / 2;
        this.y = this.height - 50;
    }

    
    stop() {
        this.speed = 0;
    }

    draw() {
        c.fillStyle = 'purple';
        c.fillRect(this.x, this.y, this.width, this.height);


       
    };

    
    update(dt) {

       
    }
}



/*====== ANIMATE THROWUPER =====*/
let lastTime = 0;

function animate() {
    
    requestAnimationFrame(animate) 

    c.clearRect(0, 0, gameWidth, gameHeight);
    
    bozo.update(dt);

    bozo.draw();
    

}




