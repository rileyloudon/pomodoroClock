// Get work time when you start, break time when it starts.
// allows you to change break time while timer is running and
// use that time when you reach it.

// Move most of time interval to inside play button.

const mainTimer = document.getElementById('main-timer');

// Default times: 25 minute work, 5 minute break.
const setTime = {
  workTime: 1500000,
  breakTime: 300000,
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
  let error = false;
  isNaN(input) ||
  input < 0 ||
  input > 59 ||
  isNaN(userInputWork.value) ||
  userInputWork.value < 0 ||
  userInputWork.value > 59
    ? (error = true)
    : (error = false);
  setDisplay(error);
};

const setDisplay = error => {
  error
    ? (mainTimer.innerHTML = 'Enter 0-59')
    : !userInputWork.value
    ? (mainTimer.innerHTML = '25:00s')
    : (mainTimer.innerHTML = userInputWork.value + ':00s');
};

const play = document.getElementById('play');
const pause = document.getElementById('pause');
play.addEventListener('click', () => {
  if (
    (!isNaN(userInputWork.value) &&
      !isNaN(userInputBreak.value) &&
      userInputWork.value > 0 &&
      userInputWork.value < 59 &&
      userInputBreak.value > 0 &&
      userInputBreak.value < 59) ||
    userInputBreak.value === '' ||
    userInputWork.value === ''
  ) {
    if (userInputWork.value) {
      setTime.workTime = userInputWork.value * 1000 * 60;
    }
    if (userInputBreak.value) {
      setTime.breakTime = userInputBreak.value * 1000 * 60 + 1000;
    }
    play.style.visibility = 'hidden';
    pause.style.visibility = 'visible';
    workCountdown();
  }
});

pause.addEventListener('click', () => {
  console.log('PAUSE');
});

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
