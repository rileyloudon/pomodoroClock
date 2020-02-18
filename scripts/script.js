const mainTimer = document.getElementById('main-timer');

// Default times: 25 minute work, 5 minute break.
const time = {
  work: null,
  break: null,
  error: false,
  paused: false,
};

// When the user enters anything in the input box, make sure it's valid.
const userInputWork = document.getElementById('work-time');
userInputWork.addEventListener('input', () => {
  checkInput();
});

// When the user enters anything in the input box, make sure it's valid.
const userInputBreak = document.getElementById('break-time');
userInputBreak.addEventListener('input', () => {
  checkInput();
});

// Check if the input is a number, and between 0-59.
// Checking the work value is also requierd otherwise the display can be set to an invalid state.
const checkInput = () => {
  isNaN(userInputWork.value) ||
  userInputWork.value < 0 ||
  userInputWork.value > 60 ||
  (userInputWork.value.includes('.') &&
    userInputWork.value.split('.')[1].length > 1) ||
  isNaN(userInputBreak.value) ||
  userInputBreak.value < 0 ||
  userInputBreak.value > 60 ||
  (userInputBreak.value.includes('.') &&
    userInputBreak.value.split('.')[1].length > 1)
    ? (time.error = true)
    : (time.error = false);
  setDisplay();
};

// Display the correct info, depending on the users input.
const setDisplay = () => {
  time.error
    ? // If error
      ((mainTimer.innerHTML = 'Enter 0-59. Max 1 Decimal Place'),
      mainTimer.classList.add('error'))
    : // If the user enters nothing into the work input
    !userInputWork.value
    ? ((mainTimer.innerHTML = '25:00s'), mainTimer.classList.remove('error'))
    : // If the work input includes a decimal
    userInputWork.value.includes('.')
    ? ((mainTimer.innerHTML =
        userInputWork.value.split('.')[0] + ':' + secondsDisplay() + 's'),
      mainTimer.classList.remove('error'))
    : // No decimal
      ((mainTimer.innerHTML = userInputWork.value + ':00s'),
      mainTimer.classList.remove('error'));
};

const secondsDisplay = () => {
  let afterDecimal = userInputWork.value.split('.')[1] * 6;
  afterDecimal < 10 ? (afterDecimal = '0' + afterDecimal) : afterDecimal;
  return afterDecimal;
};

// Watch for the play button to be pressed.
const play = document.getElementById('play');
const pause = document.getElementById('pause');
play.addEventListener('click', () => {
  if (time.error === false) {
    // If the user doesnt enter anything, default to a 25 minute work timer.
    if (!userInputWork.value) {
      userInputWork.value = 25;
    }
    // If the user doesnt enter anything, default to a 5 minute break timer.
    if (!userInputBreak.value) {
      userInputBreak.value = 5;
    }
    if (time.paused === false) {
      workCountdown();
    }

    time.paused = false;

    // Swap the buttons
    play.style.visibility = 'hidden';
    pause.style.visibility = 'visible';

    // Disable entering inputs once the timer starts.
    userInputWork.readOnly = true;
    userInputBreak.readOnly = true;
  }
});

// Watch for the pause button to be pressed.
pause.addEventListener('click', () => {
  time.paused = true;

  // Swap the buttons back.
  play.style.visibility = 'visible';
  pause.style.visibility = 'hidden';
});

const workCountdown = () => {
  // Convert the users input to milliseconds.
  time.work = userInputWork.value * 1000 * 60;
  // End of the timer is the current time + the users input.
  let endTime = new Date().getTime() + time.work;
  // Tell the countdown timer what timer (work/break) to do next.
  let next = 'break';
  runCountdown(endTime, next);
};

const breakCountdown = () => {
  time.break = userInputBreak.value * 1000 * 60 + 1000;
  let endTime = new Date().getTime() + time.break;
  let next = 'work';
  runCountdown(endTime, next);
};

const runCountdown = (endTime, next) => {
  let now = new Date().getTime();
  let timeLeft = endTime - now;

  let countdown = setInterval(() => {
    // If time.paused = true this will all stop. If false it will run.
    if (!time.paused) {
      // If time left isn't accurate, fix it by adding the difference.
      //  Eg. If timeLeft = 4999, it's off by 1 millisecond.
      //  This will fix that by calculating the difference and adding it back.
      if (timeLeft % 100 !== 0) {
        let diff = 100 - (timeLeft % 100);
        timeLeft += diff;
      }

      // Subrtact 100 milliseconds from the thime left every interval.
      timeLeft -= 100;

      // Convert milliseconds to minutes and seconds.
      let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Add a 0 infront of seconds if its only one digit.
      seconds = seconds < 10 ? '0' + seconds : seconds;

      // If the time left is 0 or less, stop the countdown and run the next one (either work/break)
      if (timeLeft <= 0) {
        clearInterval(countdown);
        next === 'work' ? workCountdown() : breakCountdown();
      } else {
        // Else update the display.
        mainTimer.innerHTML = minutes + ':' + seconds + 's';
      }
    }
    // Update every 100 milliseconds to help prevent time left from getting out of sync.
  }, 100);
};
