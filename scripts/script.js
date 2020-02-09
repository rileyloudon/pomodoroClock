const mainTimer = document.getElementById('main-timer');

const setTime = {
  workTime: null,
  // workTime: 5000,
  breakTime: 11000,
};

const userInput = document.getElementById('work-time');

userInput.addEventListener('input', () => {
  if (isNaN(userInput.value)) {
    mainTimer.innerHTML = 'Please enter a number.';
  } else {
    mainTimer.innerHTML = userInput.value + ':00s';
  }
});

const setDisplay = () => {
  mainTimer.innerHTML = userInput.value + ':00s';
};

const workCountdown = () => {
  let time = new Date().getTime() + setTime.workTime;
  let next = 'break';
  runCountdown(time, next);
};

const breakCountdown = () => {
  let time = new Date().getTime() + setTime.breakTime;
  let next = 'work';
  runCountdown(time, next);
};

const runCountdown = (time, next) => {
  let countdown = setInterval(() => {
    let now = new Date().getTime();

    let timeLeft = time - now;
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    seconds = seconds < 10 ? '0' + seconds : seconds;

    if (timeLeft < 100) {
      clearInterval(countdown);
      next === 'work' ? workCountdown() : breakCountdown();
    }
    mainTimer.innerHTML = minutes + ':' + seconds + 's';
  }, 100);
};

const play = document.getElementById('play');
play.addEventListener('click', () => {
  if (!isNaN(userInput.value)) {
    setTime.workTime = userInput.value * 1000 * 60 + 1000;
    workCountdown();
  }
});

setDisplay();
