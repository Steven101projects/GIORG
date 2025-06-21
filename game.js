document.addEventListener("DOMContentLoaded", () => {

    gameSetup();

});
const windows = Array.from(document.querySelectorAll(".window"));
const livesContainer = document.querySelector('.lives');


var time = document.getElementById("timer");
let timeLeft = 60;
let lives = 9;

// Update the display to show mm:ss
function updateDisplay(sec) {
    time.textContent = `${sec}`;
}

function gameSetup() {
timeLeft = 10;
    let countdown = 3;
    let i = 0;
    let readySetGo = setInterval(() => {
        windows[i].classList.add("highlight");
        windows[i].textContent = `${countdown}`;
        i++;
        countdown--;
        if(i === 3){
              windows[4].style.backgroundImage = 'url("nico.png")';
        }
        if (i === 4) {
            clearInterval(readySetGo);
            for (w of windows) {
                w.textContent = "";
                w.classList.remove("highlight");
                w.style.backgroundImage = 'none';
            }
        }
    }, 1000);
    setTimeout(whackANico, 3000);
}
function Time() {

    updateDisplay(timeLeft);

    // Every second, decrease and refresh
    const timerId = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerId);
            return;
        }
        updateDisplay(timeLeft);
    }, 1000);

}
function whackANico() {
    Time();

    let game = setInterval(() => {
    const rnd = Math.floor(Math.random() * 10);

    const win = document.createElement("img");
    win.classList.add("win");
    windows[rnd].appendChild(win);

    let safe = false;
    win.addEventListener("click", function(){
    safe = true;
    });


setTimeout(function() {
    windows[rnd].removeChild(win); 
    if(!safe){
        lives--;
        livesContainer.removeChild(livesContainer.lastElementChild);
    }
}, 920);
    if(timeLeft === 0 || lives === 0){
        document.getElementById("gameOver").style.display = "flex";
        clearInterval(game);
      }
      if(timeLeft == 0 && lives !== 0){
        document.getElementById("youWin").style.display = "flex";
        document.getElementById("gameOver").style.display = "none";
        windows[4].style.backgroundImage = 'url("nico.png")';
        clearInterval(game);
      }
    }, 1000);

}



document.getElementById('retry').addEventListener("click", function(){
    document.getElementById("gameOver").style.display = "none";
    gameSetup();
})

