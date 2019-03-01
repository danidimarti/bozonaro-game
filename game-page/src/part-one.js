/*==== GLOBAL VARIABLES ==== */
var ctx = document.getElementById("canvas").getContext('2d');
var gameWidth = canvas.width;
var gameHeight = canvas.height;
var background = new Image();
var thrower = new Image();
var bozo = new Image();
var vomit = new Image();

var throwerObj = {
    "x": 100,
    "y": 350,
    "width": 30,
}

var bozoObj = {
    'height': 50,
    'width': 50,
    'spd': 3
};

/*==== LOADING RESOURCES ==== */

background.onload = function () {
    thrower.onload = function () {
        bozo.onload = function () {
            vomit.onload = function () {
                
                drawObject = function(object,x,y,width,height) {
                    ctx.drawImage(object,x,y,width,height);
                }
                startGame = function () {
                    score = 0;
                    level = 100;
                    thrower.y = 350;
                    thrower.x = 100;
                    thrower.leftPressed = false;
                    thrower.rightPressed = false;
                    animation = 0;
                    bozoTimer = 0;
                    gameover = false;
                    vomitList = [];
                    bozoList = [];

                }
                vomit.src = "assets/vomit.png"
            }
            bozo.src = "assets/Bozo-Head.png"
        }
        thrower.src = "assets/open-mouth-smaller.png"
    }
    background.src = "assets/bg.png";
}
