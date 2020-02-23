const clock = document.getElementById('clock');
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

// Check if the input is a number, and between 0-60.
const checkInput = () => {
  isNaN(userInputWork.value) ||
  userInputWork.value < 0 ||
  userInputWork.value > 60 ||
  isNaN(userInputBreak.value) ||
  userInputBreak.value < 0 ||
  userInputBreak.value > 60
    ? (time.error = 'invalid number')
    : (time.error = false);

  // Make sure the decimal place is valid.
  // Only dispaly this error if the numbers don't return an error.
  if (
    time.error === false &&
    (userInputWork.value.includes('.') || userInputBreak.value.includes('.'))
  ) {
    (userInputWork.value.includes('.') &&
      userInputWork.value.split('.')[1].length > 1) ||
    (userInputBreak.value.includes('.') &&
      userInputBreak.value.split('.')[1].length > 1)
      ? (time.error = 'invalid decimal')
      : (time.error = false);
  }

  // Add the error class so the page can be styled on error.
  if (time.error !== false) {
    clock.classList.add('error');
    clock.classList.remove('no-error');
  } else if (clock.classList.contains('error')) {
    clock.classList.add('no-error');
    clock.classList.remove('error');
  }
  setDisplay();
};

// Display the correct info, depending on the users input.
const setDisplay = () => {
  // If there's an error, display what's wrong.
  if (time.error !== false) {
    time.error === 'invalid number'
      ? (mainTimer.innerHTML = 'Enter 0-60')
      : (mainTimer.innerHTML = 'Max 1 Decimal Place');
  } else {
    // If there's no input
    !userInputWork.value
      ? (mainTimer.innerHTML = '25:00s')
      : // If the work input includes a decimal
      userInputWork.value.includes('.')
      ? (mainTimer.innerHTML = minuteDisplay() + ':' + secondsDisplay() + 's')
      : // No decimal
        (mainTimer.innerHTML = userInputWork.value + ':00s');
  }
};

// Add a 0 before the : if there's 0 minutes left.
const minuteDisplay = () => {
  let beforeDecimal = userInputWork.value.split('.')[0];
  beforeDecimal === '' ? (beforeDecimal = 0) : beforeDecimal;
  return beforeDecimal;
};

// Add a 0 before the last digit if there's less than 10 seconds left.
const secondsDisplay = () => {
  let afterDecimal = userInputWork.value.split('.')[1] * 6;
  afterDecimal < 10 ? (afterDecimal = '0' + afterDecimal) : afterDecimal;
  return afterDecimal;
};

// Watch for the play button to be pressed.
const play = document.getElementById('playBtn');
const pause = document.getElementById('pauseBtn');
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

    if (time.paused === false) {
      clock.classList.remove('paused');
      clock.classList.add('play');
    } else {
      clock.classList.remove('paused');
      clock.classList.add('resume');
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

  clock.classList.remove('play');
  clock.classList.remove('resume');
  clock.classList.add('paused');

  // Swap the buttons back.
  play.style.visibility = 'visible';
  pause.style.visibility = 'hidden';
});

const workCountdown = running => {
  // Convert the users input to milliseconds.
  // If the countdown loops back to work, add 1 second to the timer so it will display properly.
  running === true
    ? (time.work = userInputWork.value * 1000 * 60 + 1000)
    : (time.work = userInputWork.value * 1000 * 60);
  // End of the timer is the current time + the users input.
  let endTime = new Date().getTime() + time.work;
  // Tell the countdown timer what timer (work/break) to do next.
  let current = 'work';
  runCountdown(endTime, current);
};

const breakCountdown = () => {
  time.break = userInputBreak.value * 1000 * 60 + 1000;
  let endTime = new Date().getTime() + time.break;
  let current = 'break';
  runCountdown(endTime, current);
};

const runCountdown = (endTime, current) => {
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

      // Subrtact 100 milliseconds from the time every interval.
      timeLeft -= 100;

      // Convert milliseconds to minutes and seconds.
      let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Add a 0 infront of seconds if its only one digit.
      seconds = seconds < 10 ? '0' + seconds : seconds;

      // If the time left is 0 or less, stop the countdown and run the next one (either work/break)
      if (timeLeft <= 0) {
        clearInterval(countdown);
        current === 'work' ? breakCountdown() : workCountdown(true);
      } else {
        // Else update the display.
        mainTimer.innerHTML = minutes + ':' + seconds + 's';
      }
    }
    // Update every 100 milliseconds to help prevent time left from getting out of sync.
  }, 100);
};

checkInput();
