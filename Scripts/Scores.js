//Gets easy high score
function get_high_score() {
    var highScore = localStorage.getItem('highScore');
    if (highScore == null) {
        highScore = [];
    } else {
        return JSON.parse(highScore);
    }
    return highScore;
}
//Gets medium high score
function get_high_score_medium() {
    var highScoreMedium = localStorage.getItem('highScoreMedium');
    if (highScoreMedium == null) {
        highScoreMedium = [];
    } else {
        return JSON.parse(highScoreMedium);
    }
    return highScoreMedium;
}
//Gets hard high score
function get_high_score_hard() {
    var highScoreHard = localStorage.getItem('highScoreHard');
    if (highScoreHard == null) {
        highScoreHard = [];
    } else {
        return JSON.parse(highScoreHard);
    }
    return highScoreHard;
}
//Adds new easy high score to the local storage
function add_high_score() {
    var highScore = get_high_score();
    var score = aliensCaptured;
    highScore.splice(0, 0, score);
    localStorage.setItem('highScore', JSON.stringify(highScore));
    show_high_score();
}
//Adds new medium high score to the local storage
function add_high_score_medium() {
    var highScoreMedium = get_high_score_medium();
    var scoreMedium = aliensCaptured;
    highScoreMedium.splice(0, 0, scoreMedium);
    localStorage.setItem('highScoreMedium', JSON.stringify(highScoreMedium));
    show_high_score_medium();
}
//Adds new hard high score to the local storage
function add_high_score_hard() {
    var highScoreHard = get_high_score_hard();
    var scoreHard = aliensCaptured;
    highScoreHard.splice(0, 0, scoreHard);
    localStorage.setItem('highScoreHard', JSON.stringify(highScoreHard));
    show_high_score_hard();
}
//Diplays easy high scores
function show_high_score() {
    var highScore = get_high_score();
    $('#scores li').remove();
    highScore.sort(function (a, b) { return b - a });
    var highScore2 = highScore.slice(0, 10);
    //console.log(highScore[0].score); 
    for (var idx = 0; idx < highScore2.length; idx++) {
        $('#scores ol').append('<li>' + 'Aliens Captured: ' + highScore2[idx] + '</li>');
    }
}
//Diplays medium high scores
function show_high_score_medium() {
    var highScoreMedium = get_high_score_medium();
    $('#scores li').remove();
    highScoreMedium.sort(function (a, b) { return b - a });
    var highScoreMedium2 = highScoreMedium.slice(0, 10);
    for (var idx = 0; idx < highScoreMedium2.length; idx++) {
        $('#scores ol').append('<li>' + 'Aliens Captured: ' + highScoreMedium2[idx] + '</li>');
    }
}
//Diplays hard high scores
function show_high_score_hard() {
    var highScoreHard = get_high_score_hard();
    $('#scores li').remove();
    highScoreHard.sort(function (a, b) { return b - a });
    var highScoreHard2 = highScoreHard.slice(0, 10);
    for (var idx = 0; idx < highScoreHard2.length; idx++) {
        $('#scores ol').append('<li>' + 'Aliens Captured: ' + highScoreHard2[idx] + '</li>');
    }
}
//Deletes all high scores according to selected level
function clear_highScore(ev) {
    //Prevents default action 
    ev.preventDefault();
    // deletes all values inside the name array 
    if (level == 100) {
        localStorage.removeItem('highScore');
        $('#scores li').fadeOut(function () {
            $('#scores li').empty();
        });
        show_high_score();
    } else if (level == 150) {
        localStorage.removeItem('highScoreMedium');
        $('#scores li').fadeOut(function () {
            $('#scores li').empty();
        });
        show_high_score_medium();
    } else if (level == 200) {
        localStorage.removeItem('highScoreHard');
        $('#scores li').fadeOut(function () {
            $('#scores li').empty();
        });
        show_high_score_hard();
    }
}

//Calls the clear_highScore function when a link is clicked				
$('#right').on('click', 'a', clear_highScore);

//show_high_score();
if (level == 100) {
    show_high_score();
} else if (level == 150) {
    show_high_score_medium();
} else if (level == 200) {
    show_high_score_hard();
}