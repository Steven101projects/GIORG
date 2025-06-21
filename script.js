document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gameRules").style.display = "none";
});


document.getElementById("answer").addEventListener("input", function (e) {
  const val = e.target.value.trim().toLowerCase();     // normalise
  const damn = document.getElementById("damn");

  if (val === "yes") {
    damn.textContent = "DAMN. PLAY THIS GAME THEN";
    damn.style.display = "inline";
setTimeout(() => {
  document.getElementById("gameRules").style.display = "flex";
}, 3000);
  } else if (val === "no"){
    damn.textContent = "Oh stop, we all know it's your birthday.. Please say yes.. : ("
    damn.style.display = "inline";
  } else {
    damn.style.display = "none";
  }
});

document.getElementById("g").addEventListener("click", function(){
  gameStart();
})
function gameStart(){
    window.location.href = "game.html";
}