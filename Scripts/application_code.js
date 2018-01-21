// JavaScript Document
// function called to be loaded on load by the <body>
function oneTimeTasks() {
    gameInterval = setInterval(main, 1);
    started = false;
    //musicOn = true;
    //music.play();
}

//Plays the game's song
function playMusic() {
    if (musicOn) {
        musicOn = false;
        music.pause();
        $('#music').val("TURN MUSIC ON");
    } else {
        musicOn = true;
        music.play();
        $('#music').val("TURN MUSIC OFF");
    }
}
// Create the canvas
var canvasElement = $("#canvas");
var ctx = canvas.getContext("2d");
var canvas_width = canvasElement.width;
var canvas_height = canvasElement.height;

// Game objects
var spaceship = {
    speed: 300 // movement in pixels per second
};

var numberOfAliens = 2;
var aliens = [];
var currentAlienSpeed = 0;

function populateAliens() {
    //loop though each alien and add to loop
    for (i = 0; i < numberOfAliens; i++) {

        var alienObject = {
            speed: level,
            x: 24 + (Math.random() * (canvas.width - 48)),
            y: -35
        };
        //add alien to array
        aliens.push(alienObject);
        //ensures theres no overllaping
        resetAlienPosition(i);
    }
}

//assigns a level variable, value is got from the select level menu
var level = $("#level").val();
level = parseInt(level); // transforms the value into integer

// changes the aliens speed according to the level
$('#level').on('change', function (ev) {
    ev.preventDefault();
    var link = $(this);

    for (i = 0; i < numberOfAliens; i++) {
        aliens[i].speed = parseInt(this.value);
    }

    level = parseInt(this.value);

    if (level == 100) {
        $('#score').html('Top 10 Scores Easy');
        show_high_score();
    } else if (level == 150) {
        $('#score').html('Top 10 Scores Medium');
        show_high_score_medium();
    } else if (level == 200) {
        $('#score').html('Top 10 Scores Hard');
        show_high_score_hard();
    }
});

//creates a new variable
var aliensCaptured = 0;

//Stores Lives Remaining
var livesRemaining = 3;

// Positions the Spaceship
spaceship.x = canvas.width / 2 - 50;
spaceship.y = canvas.height - 100;

//start the game
function start_game() {
    started = true;
    $('#level').attr('disabled', 'disabled');

}
// calls the start_game function when user clicks inside the canvas
$('#center').on('click', 'canvas', start_game);

// Handle keyboard controls
var keysDown = {
};
//Key down event
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    e.preventDefault();
    e.stopImmediatePropagation();
}, false);
//Key up event
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var maxSpawDistance = 500;
// Alien spams at the top when the player catches the alien
var resetAlienPosition = function (i) {
    // Throw the monster somewhere on the screen randomly
    aliens[i].x = 24 + (Math.random() * (canvas.width - 48));
    //loop though each alien 
    for (j = 0; j < aliens.length; j++) {
        console.log(i + ": " + aliens[i].x);
        //ensures its not comparing agains itself
        if (i != j) {
            var widthDifference = aliens[i].x - aliens[j].x
            //this means they are overlapping, so try a random number again
            if (widthDifference < 25 && widthDifference > -25) {
                resetAlienPosition(i);
                //if the distance between the alien and any other alien is greater than the max spawDistance, try a random number again
            } else if (widthDifference > maxSpawDistance || widthDifference < -maxSpawDistance) {
                resetAlienPosition(i);
            }
        }
    }

    aliens[i].y = -35;
};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && started) { // Player holding Up Arrow 
        if (!(spaceship.y < 10)) {
            spaceship.y -= spaceship.speed * modifier;
        }
    }
    if (40 in keysDown && started) { // Player holding Down Arrow
        if (!(spaceship.y > canvas.height - 115)) {
            spaceship.y += spaceship.speed * modifier;
        }
    }
    if (37 in keysDown && started) { // Player holding Left Arrow
        if (!(spaceship.x < 10)) {
            spaceship.x -= spaceship.speed * modifier;
        }
    }
    if (39 in keysDown && started) { // Player holding Right Arrow
        if (!(spaceship.x > canvas.width - 80)) {
            spaceship.x += spaceship.speed * modifier;
        }
    }
    //Animates the alliens if the game started
    if (started) {
        for (i = 0; i < numberOfAliens; i++) {
            aliens[i].y += aliens[i].speed * modifier;
        }
    };

    //loop though each alien 
    for (i = 0; i < numberOfAliens; i++) {
        //Detects if the alien is touching the spaceship
        if (
            spaceship.x <= (aliens[i].x + 12)
            && aliens[i].x <= (spaceship.x + 72)
            && spaceship.y <= (aliens[i].y + 35)
            && aliens[i].y <= (spaceship.y + 90)
        ) {
            //Plays the capture sound
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                capture.currentTime = 0;
                capture.play();
            } else {
                capture.src = capture.src;
                capture.play();
            }
            ++aliensCaptured;
            currentAlienSpeed += 2;
            aliens[i].speed = level + currentAlienSpeed;
            resetAlienPosition(i);
        }

        // Have the alies won?
        if (aliens[i].y >= canvas.height + 40) {
            //deduct one life
            livesRemaining--;
            if (livesRemaining < 1) {

                keysDown = [];
                clearInterval(gameInterval);
                started = false;
                var currentScore = aliensCaptured;
                var easy = get_high_score();
                easy.sort(function (a, b) { return b - a });
                var medium = get_high_score_medium();
                medium.sort(function (a, b) { return b - a });
                var hard = get_high_score_hard();
                hard.sort(function (a, b) { return b - a });
                //checks if the user has scored a new high score								
                if (currentScore > easy[0] && level == 100) {
                    alert("Well done!!!! You have a new high score for the Easy level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
                } else if (currentScore > medium[0] && level == 150) {
                    alert("Well done!!!! You have a new high score for the Medium level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
                } else if ((currentScore > hard[0]) && (level == 200)) {
                    alert("Well done!!!! You have a new high score for the Hard level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
                } else {
                    alert("The Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
                }
                //adds the score to the local storage
                if (level == 100) {
                    add_high_score();
                } else if (level == 150) {
                    add_high_score_medium();
                } else if (level == 200) {
                    add_high_score_hard();
                }
                //resets the game             
                $('#level').removeAttr('disabled', 'disabled');
                spaceship.x = canvas.width / 2 - 50;
                spaceship.y = canvas.height - 100;
                aliensCaptured = 0;

                for (j = 0; j < numberOfAliens; j++) {
                    aliens[j].speed = parseInt($('#level').val());
                    aliens[j].y = -35;
                }
                gameInterval = setInterval(main, 1);
                //resets live remaining
                livesRemaining = 3;
                //set incremental speed to 0
                currentAlienSpeed = 0
                //exits loop
                break;
            }
            else {
                //reset the alien position to the top of the canvas
                resetAlienPosition(i);
            }
        }
    }

}; //ends update function

// Draw everything
var render = function () {

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (spaceshipReady) {
        ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y);
    }

    if (alienReady) {
        for (i = 0; i < numberOfAliens; i++) {
            ctx.drawImage(alienImage, aliens[i].x, aliens[i].y);
        }
    }

    // Score
    if (started) {
        ctx.fillStyle = "#3C3";
        ctx.font = "25px Verdana";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("" + aliensCaptured, 32, 32);
        //Lives Remaining
        ctx.font = "14px Verdana";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("Lives Remaining: " + livesRemaining, 550, 32);
    } else {
        ctx.fillStyle = "#3C3";
        ctx.font = "25px Verdana";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Click to start the game", 150, 100);
    }
}; // ends render function

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
};
// Starts the game
populateAliens();

var then = Date.now();