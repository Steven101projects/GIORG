document.addEventListener("DOMContentLoaded", () => {
  stopAllAudio();
  gameSetup();
  audio();
});

const windows = Array.from(document.querySelectorAll(".window"));
const livesContainer = document.querySelector('.lives');
const timerEl       = document.getElementById("timer");

let timeLeft = 60;
let lives    = 9;
let timerId;  // for our countdown interval

// ─── Helpers ─────────────────────────────────────────────────────────

function updateDisplay(sec) {
  timerEl.textContent = sec;
}

function renderHearts(count) {
  if (!livesContainer) return;
  livesContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className   = 'heart';
    span.textContent = '❤️';
    livesContainer.appendChild(span);
  }
}

// ─── Game Setup / Countdown ──────────────────────────────────────────

function gameSetup() {
  lives     = 9;
  timeLeft  = 60;
  renderHearts(lives);
  updateDisplay(timeLeft);

  let countdown = 3;
  let idx       = 0;
  const readySetGo = setInterval(() => {
    windows[idx].classList.add("highlight");
    windows[idx].textContent = countdown;
    idx++;
    countdown--;

    if (idx === 3) {
      windows[4].style.backgroundImage = 'url("nico.png")';
    }
    if (idx === 4) {
      clearInterval(readySetGo);
      windows.forEach(w => {
        w.classList.remove("highlight");
        w.textContent = "";
        w.style.backgroundImage = 'none';
      });
      whackANico();
    }
  }, 800);
}

// ─── Timer ───────────────────────────────────────────────────────────

function startTimer() {
  clearInterval(timerId);
  updateDisplay(timeLeft);
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay(timeLeft);

    // stop the timer when time is up or no lives left
    if (timeLeft <= 0 || lives <= 0) {
      clearInterval(timerId);
    }
  }, 1000);
}

// ─── Main Game Loop ──────────────────────────────────────────────────

function whackANico() {
  // give player 10 seconds in the actual “whack” phase
  timeLeft = 60;
  updateDisplay(timeLeft);
  startTimer();

  const game = setInterval(() => {
    // 1) spawn a “nico” in a random window
    const rnd = Math.floor(Math.random() * windows.length);
    const winImg = document.createElement("img");
    winImg.classList.add("win");
    windows[rnd].appendChild(winImg);

    let safe = false;
    winImg.addEventListener("click", () => {
      safe = true;
      document.getElementById('oof').play();
      winImg.style.backgroundImage = 'url("poked.webp")';
    });

    // 2) after 880ms, remove it and penalize if not clicked
    setTimeout(() => {
      windows[rnd].removeChild(winImg);
      if (!safe) {
        lives--;
        renderHearts(lives);
      }
    }, 880);

    // 3) update “easyBox” messages
    const msgBox = document.getElementById('easyBox');
    if      (lives === 8) { moveEasyBox(); msgBox.textContent = "this is too easy";        msgBox.style.display = "inline-block"; }
    else if (lives === 5) { moveEasyBox(); msgBox.textContent = "please start playing";   msgBox.style.display = "inline-block"; }
    else if (lives === 3) { moveEasyBox(); msgBox.textContent = "i'm just here!";         msgBox.style.display = "inline-block"; }
    else if (lives === 2) { moveEasyBox(); msgBox.textContent = "where is your uno luck?"; msgBox.style.display = "inline-block"; }
    else                  { msgBox.style.display = "none"; }
    if (timeLeft === 30 && lives > 0) {
      moveEasyBox();
      msgBox.textContent = "holy shit i'm losing this";
      msgBox.style.display = "inline-block";
    }

    // 4) check for end conditions, win vs lose
    if (timeLeft <= 0) {
      clearInterval(game);
      clearInterval(timerId);
      if (lives > 0) {
        // **WIN**
        showWin();
        stopAllAudio();
        document.getElementById("gameOver").style.display = "none";
        windows[4].style.backgroundImage = 'url("nico.png")';
      } else {
        // **LOSE**
        document.getElementById("gameOver").style.display = "flex";
      }
    } 
    else if (lives <= 0) {
      clearInterval(game);
      clearInterval(timerId);
      document.getElementById("gameOver").style.display = "flex";
    }

  }, 1000);
}

// ─── Retry Button ────────────────────────────────────────────────────

document.getElementById('retry').addEventListener("click", () => {
  document.getElementById("gameOver").style.display = "none";
  gameSetup();
});

// ─── Audio Controls ──────────────────────────────────────────────────

function audio() {
  const bg    = document.getElementById('bgMusic');
  const cnt   = document.getElementById('countdown');
  bg.loop   = true;
  bg.volume = 0.5;
  bg.play().catch(e => console.warn('Audio autoplay prevented:', e));
  cnt.play();
}

function stopAllAudio() {
  ['bgMusic','countdown','oof'].forEach(id => {
    const t = document.getElementById(id);
    if (!t) return;
    t.pause();
    t.currentTime = 0;
  });
}

// ─── You Win Modal ───────────────────────────────────────────────────

function showWin() {
  const modal = document.getElementById('youWin');
  modal.classList.remove('hide');
  modal.classList.add('show');
  document.getElementById('bday').play();
}

// ─── EasyBox Movement ───────────────────────────────────────────────

function moveEasyBox() {
  const box = document.getElementById('easyBox');
  const prev = getComputedStyle(box).display;
  if (prev === 'none') box.style.display = 'block';

  const { width, height } = box.getBoundingClientRect();
  const MARGIN = 20;
  const maxLeft = window.innerWidth  - width  - MARGIN;
  const maxTop  = window.innerHeight - height - MARGIN;

  box.style.left   = `${MARGIN + Math.random() * maxLeft}px`;
  box.style.top    = `${MARGIN + Math.random() * maxTop}px`;
  box.style.right  = 'auto';
  box.style.bottom = 'auto';

  box.style.display = prev;
}
