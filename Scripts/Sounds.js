//Adding sounds
var music = new Audio("Music/audio.mp3");
music.volume = 0.2;
music.addEventListener('ended', function () {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        this.currentTime = 0;
        this.play();
    } else {
        this.src = music.src;
        this.play();
    }

}, false);
var capture = new Audio("Music/kill.wav");