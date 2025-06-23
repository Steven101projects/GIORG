document.addEventListener("DOMContentLoaded", () => {

gameSetup();
audio();

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

function renderHearts(count) {
  const container = document.querySelector('.lives');
  if (!container) return;

  // Remove any hearts that were there before
  container.innerHTML = '';

  // Build the new set
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'heart';
    span.textContent = '❤️';   // or replace with an image
    container.appendChild(span);
  }
}

function gameSetup() {
    renderHearts(lives);
timeLeft = 60;
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
function showWin() {
  const modal = document.getElementById('youWin');
  modal.classList.remove('hide');
  modal.classList.add('show');
  document.getElementById('bday').play();
};
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
    document.getElementById('oof').play();
    document.querySelector(".win").style.backgroundImage = 'url("poked.webp")';
    });


setTimeout(function() {
    windows[rnd].removeChild(win);
    if(!safe){
        lives--;
        livesContainer.removeChild(livesContainer.lastElementChild);
    }
}, 880);

    let msgBox = document.getElementById('easyBox');
    if(lives === 8){
        moveEasyBox()
        msgBox.style.display = "inline-block";
        msgBox.textContent = "this is too easy";
    } else if (lives === 5){
        moveEasyBox()
        msgBox.style.display = "inline-block";
        msgBox.textContent = "please start playing";
    }else if(lives === 3){
        moveEasyBox()
        msgBox.style.display = "inline-block";
        msgBox.textContent = "i'm just here!";
    }else if(lives === 2){
        moveEasyBox()
        msgBox.style.display = "inline-block";
        msgBox.textContent = "where is your uno luck?";
    }else{
        msgBox.style.display = "none";
    }

    if(timeLeft == 30 && lives !== 0){
        moveEasyBox()
        msgBox.style.display = "inline-block";
        msgBox.textContent = "holy shit i'm losing this";
    } 
    if(timeLeft === 0 || lives === 0){
        document.getElementById("gameOver").style.display = "flex";
        clearInterval(game);
      }
      if(timeLeft == 0 && lives !== 0){
        showWin();
        stopAllAudio()
        document.getElementById("gameOver").style.display = "none";
        windows[4].style.backgroundImage = 'url("nico.png")';
        clearInterval(game);
      }
    }, 1000);

}



document.getElementById('retry').addEventListener("click", function(){
    document.getElementById("gameOver").style.display = "none";
    lives = 9;
    gameSetup();
})


function audio(){
    const cnt  = document.getElementById('countdown');
    const audio = document.getElementById('bgMusic');

    audio.loop = true;          // Enable looping
    audio.volume = 0.5;         // Set initial volume (50%)

    // Start audio playback
    audio.play().catch((error) => {
        // Playback might be blocked by browser restrictions.
        console.warn('Audio autoplay prevented:', error);
    });

    cnt.play();
}
function stopAllAudio() {
  // Grab the <audio> elements
  const tracks = [
    document.getElementById('bgMusic'),
    document.getElementById('countdown'),
    document.getElementById('oof'),
  ];

  tracks.forEach(track => {
    if (!track) return;          // safety check
    track.pause();               // stop playback
    track.currentTime = 0;       // reset to beginning
  });
}

/**
 * Move #easyBox to a random spot fully inside the viewport.
 * Works best if #easyBox { position: fixed }  (so it’s relative to the window)
 */
function moveEasyBox() {
  const box = document.getElementById('easyBox');

  // Make sure the element is measurable
  const prevDisplay = box.style.display;
  if (getComputedStyle(box).display === 'none') box.style.display = 'block';

  const boxRect = box.getBoundingClientRect();

  // Viewport dimensions
  const vpWidth  = window.innerWidth;
  const vpHeight = window.innerHeight;

  // Keep a buffer so it never hugs the edges
  const MARGIN = 20; // px

  const maxLeft = vpWidth  - boxRect.width  - MARGIN;
  const maxTop  = vpHeight - boxRect.height - MARGIN;

  const left = MARGIN + Math.random() * maxLeft;
  const top  = MARGIN + Math.random() * maxTop;

  box.style.left  = `${left}px`;
  box.style.top   = `${top}px`;
  box.style.right = 'auto';
  box.style.bottom = 'auto';

  // Restore previous display state if it was hidden
  box.style.display = prevDisplay;
}