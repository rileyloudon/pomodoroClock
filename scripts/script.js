// Get work time when you start, break time when it starts.
// allows you to change break time while timer is running and
// use that time when you reach it.

// Move most of time interval to inside play button.

const mainTimer = document.getElementById('main-timer');

// Default times: 25 minute work, 5 minute break.
const time = {
  work: 1500000,
  break: 300000,
  error: false,
  paused: false,
};

const userInputWork = document.getElementById('work-time');
userInputWork.addEventListener('input', () => {
  checkInput(userInputWork.value);
});

const userInputBreak = document.getElementById('break-time');
userInputBreak.addEventListener('input', () => {
  checkInput(userInputBreak.value);
});

const checkInput = input => {
  isNaN(input) ||
  input < 0 ||
  input > 59 ||
  isNaN(userInputWork.value) ||
  userInputWork.value < 0 ||
  userInputWork.value > 59
    ? (time.error = true)
    : (time.error = false);
  setDisplay();
};

const setDisplay = () => {
  time.error
    ? (mainTimer.innerHTML = 'Enter 0-59')
    : !userInputWork.value
    ? (mainTimer.innerHTML = '25:00s')
    : (mainTimer.innerHTML = userInputWork.value + ':00s');
};

const play = document.getElementById('play');
const pause = document.getElementById('pause');
play.addEventListener('click', () => {
  if (time.error === false) {
    if (time.paused === false) {
      workCountdown();
    }
    time.paused = false;
    play.style.visibility = 'hidden';
    pause.style.visibility = 'visible';
  }
});

pause.addEventListener('click', () => {
  time.paused = true;
  play.style.visibility = 'visible';
  pause.style.visibility = 'hidden';
});

const workCountdown = () => {
  if (userInputWork.value) {
    time.work = userInputWork.value * 1000 * 60;
  }
  let endTime = new Date().getTime() + time.work;
  let next = 'break';
  userInputWork.disabled = true;
  runCountdown(endTime, next);
};

const breakCountdown = () => {
  if (userInputBreak.value) {
    time.break = userInputBreak.value * 1000 * 60 + 1000;
  }
  let endTime = new Date().getTime() + time.break;
  let next = 'work';
  userInputBreak.disabled = true;

  runCountdown(endTime, next);
};

const runCountdown = (endTime, next) => {
  let now = new Date().getTime();
  let timeLeft = endTime - now;

  let countdown = setInterval(() => {
    if (!time.paused) {
      console.log(timeLeft);
      if (timeLeft % 100 !== 0) {
        let diff = 100 - (timeLeft % 100);
        timeLeft += diff;
      }
      timeLeft -= 100;

      let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      seconds = seconds < 10 ? '0' + seconds : seconds;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        next === 'work' ? workCountdown() : breakCountdown();
      } else {
        mainTimer.innerHTML = minutes + ':' + seconds + 's';
      }
    }
  }, 100);
};
