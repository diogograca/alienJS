// JavaScript Document
// function called to be loaded on load by the <body>
function oneTimeTasks() {
    gameInterval = setInterval(main, 1);
    started = false;
    musicOn = true;
    music.play();
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
var ctx2 = canvas.getContext("2d");
var canvas_width = canvasElement.width;
var canvas_height = canvasElement.height;

// Game objects
var spaceship = {
    speed: 300 // movement in pixels per second
};

//assigns a level variable, value is got from the select level menu
var level = $("#level").val();
level = parseInt(level); // transforms the value into integer

var alien1 = {
    speed: level, // movement in pixels per second
};

var alien2 = {
    speed: level, // movement in pixels per second
};

// changes the aliens speed according to the level
$('#level').on('change', function (ev) {
    ev.preventDefault();
    var link = $(this);
    alien1.speed = parseInt(this.value);
    alien2.speed = parseInt(this.value);
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
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    e.preventDefault();
    e.stopImmediatePropagation();
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Another alien spams when the player catches alien 1
var reset = function () {
    // Throw the monster somewhere on the screen randomly
    alien1.x = 24 + (Math.random() * (canvas.width - 48));
    alien1.y = -35;
};

// Another alien spams when the player catches alien 2
var reset2 = function () {
    // Throw the monster somewhere on the screen randomly
    alien2.x = 24 + (Math.random() * (canvas.width - 48));
    alien2.y = -35;
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
        alien1.y += alien1.speed * modifier;
        alien2.y += alien2.speed * modifier;
    };

    //Detects if the alien is touching the spaceship
    if (
        spaceship.x <= (alien1.x + 12)
        && alien1.x <= (spaceship.x + 72)
        && spaceship.y <= (alien1.y + 35)
        && alien1.y <= (spaceship.y + 90)
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
        alien1.speed = alien1.speed + 5;
        reset();
    }

    //Detects if the alien is touching the spaceship
    if (
        spaceship.x <= (alien2.x + 12)
        && alien2.x <= (spaceship.x + 72)
        && spaceship.y <= (alien2.y + 35)
        && alien2.y <= (spaceship.y + 90)
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
        alien2.speed = alien2.speed + 5;
        reset2();
    }

    // Have the zombies won?
    if (alien1.y >= canvas.height + 40 || alien2.y >= canvas.height + 40) {
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
            reset();
            reset2();
            $('#level').removeAttr('disabled', 'disabled');
            spaceship.x = canvas.width / 2 - 50;
            spaceship.y = canvas.height - 100;
            aliensCaptured = 0;
            alien1.speed = parseInt($('#level').val());
            alien2.speed = parseInt($('#level').val());
            gameInterval = setInterval(main, 1);
            livesRemaining = 3;
        }
        else {
            //check if its alien 1 that touched the bottom
            if (alien1.y >= canvas.height + 40) {
                reset();
            }
            //check if its alien 2 that touched the bottom
            if (alien2.y >= canvas.height + 40) {
                reset2();
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

    if (alien1Ready) {
        ctx.drawImage(alien1Image, alien1.x, alien1.y);
    }

    if (alien2Ready) {
        ctx.drawImage(alien2Image, alien2.x, alien2.y);
    }

    // Score
    if (started) {
        ctx.fillStyle = "#3C3";
        ctx.font = "25px Verdana";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("" + aliensCaptured, 32, 32);

        ctx2.fillStyle = "#3C3";
        ctx2.font = "14px Verdana";
        ctx2.textAlign = "right";
        ctx2.textBaseline = "top";
        ctx2.fillText("Lives Remaining: " + livesRemaining, 550, 32);
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
reset();
reset2();
var then = Date.now();