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
		var canvas_width = canvasElement.width;
		var canvas_height =canvasElement.height;
					
		// Background image
		var bgReady = false;
		var bgImage = new Image();
		bgImage.onload = function () {
			bgReady = true;
		};
		bgImage.src = "images/background2.png";
		// spaceship image
		var spaceshipReady = false;
		var spaceshipImage = new Image();
		spaceshipImage.onload = function () {
			spaceshipReady = true;
		};
		spaceshipImage.src = "images/spaceship.png";
		// Alien 1 image
		var alien1Ready = false;
		var alien1Image = new Image();
		alien1Image.onload = function () {
			alien1Ready = true;
		};
		alien1Image.src = "images/alien2.png";
		// Alien 2 image
		var alien2Ready = false;
		var alien2Image = new Image();
		alien2Image.onload = function () {
			alien2Ready = true;
		};
		alien2Image.src = "images/alien2.png";
		
		//Adding sounds
		var music = new Audio("Music/audio.mp3");
		music.volume = 0.2;
		music.addEventListener('ended', function() {
			if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){		
			this.currentTime = 0;
			this.play();
			}else{
			this.src = music.src;
			this.play();
			}
			
    	}, false);
		var capture = new Audio("Music/kill.wav");
				
		// Game objects
		var spaceship = {
			speed: 300 // movement in pixels per second
		};
		
		//assigns a level variable, value is got from the select level menu
		var level = $("#level").val();
		level = parseInt(level); // transforms the value into integer
						
		var alien1 = {
		  speed:level , // movement in pixels per second
		};
		
		var alien2 = {
		  speed:level, // movement in pixels per second
		};
			// changes the headings colour	
		$('#Colour').on('change', function() {
			var colour = $("#Colour").val();
			if(colour == 1) {
				$('h2').css('color', '#F00');
				$('h3').css('color', '#F00');
			}else if (colour == 2){
				$('h2').css('color', '#3C3');
				$('h3').css('color', '#3C3');
			}else if (colour == 3) {
				$('h2').css('color', '#06F');
				$('h3').css('color', '#06F');
			}else if (colour == 4){		
				$('h2').css('color', '#FFF');
				$('h3').css('color', '#FFF');
			}
		
		})
		
		 // changes the font family of the body
		$('#Font').on('change', function() {
			var font = $("#Font").val();
			if(font == 1) {
				$('body').css('font-family', 'Verdana, Geneva, sans-serif');
			}else if (font == 2){
				$('body').css('font-family', 'Arial, Helvetica, sans-serif');
			}else if (font == 3) {
				$('body').css('font-family', 'Tahoma, Geneva, sans-serif');
			}else if (font == 4){
				$('body').css('font-family', 'Georgia, "Times New Roman", Times, serif');
			}
		})
		
		var level = $("#level").val();
		
		// AJAX NAVIGATION
		function ajax_nav(ev) {
			ev.preventDefault();
			var link = $(this);
			level = parseInt(this.value);
			var href = "";
			if(level == 100){
				href = "index.html";
			}else if(level == 150){	
				href = "index_medium.html";
			}else if(level == 200){
				href = "index_hard.html";
			}
			$.ajax(href).done(function(data) {
				data = $(data);
				$('#left').html(data.filter('#left').html());
				document.title = data.filter('title').html();
				history.pushState(null, document.title, href);
			});
		}
		//AJAX NAVIGATION 
		function history_nav(ev) {
			$.ajax(window.location.href).done(function(data) {
				data = $(data);
				$('#left').html(data.filter('#left').html());
				document.title = data.filter('title').html();
			});
		}
		//Calls the ajax_navigation
		$("#level").on('change', ajax_nav); 
				
		
		// changes the aliens speed according to the level
		$('#level').on('change', function(ev) {
			ev.preventDefault();
 			var link = $(this);
			alien1.speed = parseInt(this.value);
			alien2.speed = parseInt(this.value);
			level = parseInt(this.value);
			if(level == 100){
				$('#score').html('Top 10 Scores Easy');
				show_high_score();
			}else if(level == 150){
				$('#score').html('Top 10 Scores Medium');
				show_high_score_medium();
			}else if(level == 200){
				$('#score').html('Top 10 Scores Hard');
				show_high_score_hard();
			}
		});
		
		//creates a new variable
		var aliensCaptured = 0;
		
		// Positions the Spaceship
		spaceship.x = canvas.width /2 -50;
		spaceship.y = canvas.height -100;
		
		//start the game
		function start_game() {
			started = true;
			$('#level').attr('disabled', 'disabled');
			
		}
		// calls the start_game function when user clicks inside the canvas
		$('#center').on('click', 'canvas', start_game);  		
		
		//Gets easy high score
		function get_high_score(){
			var highScore = localStorage.getItem('highScore');
			if(highScore == null) {
				highScore = [];
				}else {
					return JSON.parse(highScore);
			}
			return highScore;
		}
		//Gets medium high score
		function get_high_score_medium(){
			var highScoreMedium = localStorage.getItem('highScoreMedium');
			if(highScoreMedium == null) {
				highScoreMedium = [];
				}else {
					return JSON.parse(highScoreMedium);
			}
			return highScoreMedium;
		}
		//Gets hard high score
		function get_high_score_hard(){
			var highScoreHard = localStorage.getItem('highScoreHard');
			if(highScoreHard == null) {
				highScoreHard = [];
				}else {
					return JSON.parse(highScoreHard);
			}
			return highScoreHard;
		}			
		//Adds new easy high score to the local storage
		function add_high_score(){
			var highScore = get_high_score();
			var score = aliensCaptured;
			highScore.splice(0, 0, score);
			localStorage.setItem('highScore', JSON.stringify(highScore));	
			show_high_score();		
		}
		//Adds new medium high score to the local storage
		function add_high_score_medium(){
			var highScoreMedium = get_high_score_medium();
			var scoreMedium = aliensCaptured;			
			highScoreMedium.splice(0, 0, scoreMedium);			
			localStorage.setItem('highScoreMedium', JSON.stringify(highScoreMedium));	
			show_high_score_medium();		
		}
		//Adds new hard high score to the local storage
		function add_high_score_hard(){
			var highScoreHard = get_high_score_hard();
			var scoreHard = aliensCaptured;
			highScoreHard.splice(0, 0, scoreHard);
			localStorage.setItem('highScoreHard', JSON.stringify(highScoreHard));	
			show_high_score_hard();		
		}
		//Diplays easy high scores
		function show_high_score(){
			var highScore = get_high_score();
			$('#scores li').remove();
			highScore.sort(function(a,b){return b - a});
			var highScore2 = highScore.slice(0, 10);
			//console.log(highScore[0].score); 
			for(var idx = 0; idx < highScore2.length; idx++){
				$('#scores ol').append('<li>' + 'Aliens Captured: '  +  highScore2[idx] + '</li>');
			}		
		}
		//Diplays medium high scores
		function show_high_score_medium(){
			var highScoreMedium = get_high_score_medium();
			$('#scores li').remove();
			highScoreMedium.sort(function(a,b){return b - a});
			var highScoreMedium2 = highScoreMedium.slice(0, 10);
			for(var idx = 0; idx < highScoreMedium2.length; idx++){
				$('#scores ol').append('<li>' + 'Aliens Captured: '  +  highScoreMedium2[idx] + '</li>');
			}		
		}
		//Diplays hard high scores
		function show_high_score_hard(){
			var highScoreHard = get_high_score_hard();
			$('#scores li').remove();
			highScoreHard.sort(function(a,b){return b - a});
			var highScoreHard2 = highScoreHard.slice(0, 10);
			for(var idx = 0; idx < highScoreHard2.length; idx++){
				$('#scores ol').append('<li>' + 'Aliens Captured: '  +  highScoreHard2[idx] + '</li>');
			}		
		}
		//Deletes all high scores according to selected level
		function clear_highScore(ev) {
			//Prevents default action 
			ev.preventDefault();
			// deletes all values inside the name array 
			if(level == 100){
				localStorage.removeItem('highScore');
				$('#scores li').fadeOut(function() {
					$('#scores li').empty();
				});
				show_high_score();
			}else if(level == 150){
					localStorage.removeItem('highScoreMedium');
					$('#scores li').fadeOut(function() {
					$('#scores li').empty();
				});
				show_high_score_medium();
			}else if(level == 200){
				localStorage.removeItem('highScoreHard');
				$('#scores li').fadeOut(function() {
					$('#scores li').empty();
				});
				show_high_score_hard();
			}		
		}
		//Calls the clear_highScore function when a link is clicked				
		$('#right').on('click', 'a', clear_highScore);
		
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
			alien1.x =  24 + (Math.random() * (canvas.width - 48));
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
				if (!(spaceship.y > canvas.height-115)) {
					spaceship.y += spaceship.speed * modifier;
					}
			}
			if (37 in keysDown && started) { // Player holding Left Arrow
				if (!(spaceship.x < 10)) {
					spaceship.x -= spaceship.speed * modifier;
				}
			}
			if (39 in keysDown && started) { // Player holding Right Arrow
				if (!(spaceship.x > canvas.width-80)) {
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
					if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){		
						capture.currentTime = 0;
						capture.play();
					}else{
						capture.src = capture.src;
						capture.play();
					}
					++aliensCaptured;
					alien1.speed = alien1.speed+5;
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
				if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){		
						capture.currentTime = 0;
						capture.play();
					}else{
						capture.src = capture.src;
						capture.play();
					}
					++aliensCaptured;
					alien2.speed = alien2.speed+5;
					reset2();
			}
			
   			 // Have the zombies won?
  			if (alien1.y >= canvas.height+40 || alien2.y >= canvas.height+40) {
				keysDown = [];
				clearInterval(gameInterval);
				started = false;
				var currentScore = aliensCaptured;
				var easy = get_high_score();
				easy.sort(function(a,b){return b - a});
				var medium = get_high_score_medium();
				medium.sort(function(a,b){return b - a});
				var hard = get_high_score_hard();
				hard.sort(function(a,b){return b - a});
				//checks if the user has scored a new high score								
				if(currentScore > easy[0] && level == 100){
					alert("Well done!!!! You have a new high score for the Easy level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
				}else if(currentScore > medium[0] && level == 150){
					alert("Well done!!!! You have a new high score for the Medium level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");		
				}else if((currentScore > hard[0]) && (level == 200) ){
					alert("Well done!!!! You have a new high score for the Hard level!\nThe Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");		
				}else{
					alert("The Aliens have invaded the Earth!\nYou Captured " + aliensCaptured + " aliens.\nPress OK to continue..");
				}
				//adds the score to the local storage
				if(level == 100){
					add_high_score();
				}else if(level == 150){
					add_high_score_medium();
				}else if(level == 200){
					add_high_score_hard();
				}
				//resets the game
				reset();
				reset2();
				$('#level').removeAttr('disabled', 'disabled');
				spaceship.x = canvas.width /2 -50 ;
				spaceship.y = canvas.height -100 ;
				aliensCaptured = 0;					
				alien1.speed = parseInt($('#level').val());
				alien2.speed = parseInt($('#level').val());
				gameInterval = setInterval(main, 1);
			}
  	
		}; //ends update function

		// Draw everything
		var render = function () {
	
			if (bgReady) {
				ctx.drawImage(bgImage, 0, 0);
			}
		
			if (spaceshipReady) {
				ctx.drawImage(spaceshipImage,spaceship.x,spaceship.y);
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
		//show_high_score();
		if(level == 100){
			show_high_score();
		}else if(level == 150){
			show_high_score_medium();
		}else if(level == 200){
			show_high_score_hard();
		}
		//Loads the page with AJAX when user uses the back and forwards button
		$(window).on('popstate', history_nav);
						
		
		
		
		

 
					

	