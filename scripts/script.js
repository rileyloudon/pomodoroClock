const mainTimer = document.getElementById('main-timer');

// 25 minutes from now.
let time = new Date().getTime() + 1500000;

const countdown = () => {};

setInterval(() => {
  let now = new Date().getTime();

  let timeLeft = time - now;
  let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  let seconds = Math.floor((timeLeft / 1000) % 60);

  mainTimer.innerHTML = minutes + ':' + seconds + 's';
}, 1000);
