const mainTimer = document.getElementById('main-timer');

// Default times: 25 minute work, 5 minute break.
const setTime = {
  workTime: 1501000,
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
  isNaN(input) ||
  input < 0 ||
  input > 59 ||
  isNaN(userInputWork.value) ||
  userInputWork.value < 0 ||
  userInputWork.value > 59
    ? (mainTimer.innerHTML = 'Enter 0-59')
    : !userInputWork.value
    ? (mainTimer.innerHTML = '25:00s')
    : (mainTimer.innerHTML = userInputWork.value + ':00s');
};

const setDisplay = () => {
  !userInputWork.value
    ? (mainTimer.innerHTML = '25:00s')
    : (mainTimer.innerHTML = userInputWork.value + ':00s');
};

const play = document.getElementById('play');
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
      setTime.workTime = userInputWork.value * 1000 * 60 + 1000;
    }
    if (userInputBreak.value) {
      setTime.breakTime = userInputBreak.value * 1000 * 60 + 1000;
    }
    workCountdown();
  }
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

setDisplay();
// checkInput();
