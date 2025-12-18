const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const playPauseBtn = document.getElementById('playPause');

let totalSeconds = 180; // 3 minutes default
let remainingSeconds = totalSeconds;
let isRunning = false;
let intervalId = null;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);

  timerDisplay.classList.remove('running', 'finished');

  if (remainingSeconds === 0) {
    timerDisplay.classList.add('finished');
    statusDisplay.textContent = 'DONE';
    playPauseBtn.textContent = '\u25B6'; // Play icon
  } else if (isRunning) {
    timerDisplay.classList.add('running');
    statusDisplay.textContent = 'RUNNING';
    playPauseBtn.textContent = '\u275A\u275A'; // Pause icon
  } else {
    statusDisplay.textContent = 'PAUSED';
    playPauseBtn.textContent = '\u25B6'; // Play icon
  }
}

function toggleTimer() {
  if (remainingSeconds === 0) {
    // Reset if finished
    remainingSeconds = totalSeconds;
    isRunning = false;
    updateDisplay();
    return;
  }

  isRunning = !isRunning;

  if (isRunning) {
    intervalId = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
      }
      if (remainingSeconds === 0) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
        updateDisplay();
      }
    }, 1000);
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  updateDisplay();
}

function adjustTime(delta) {
  if (isRunning) return; // Only adjust when paused

  totalSeconds = Math.max(30, totalSeconds + delta); // Minimum 30 seconds
  remainingSeconds = totalSeconds;
  updateDisplay();
}

// Listen for global keyboard shortcuts from main process
window.ghostTimer.onToggleTimer(() => {
  toggleTimer();
});

window.ghostTimer.onAdjustTime((seconds) => {
  adjustTime(seconds);
});

// Button click handlers
increaseBtn.addEventListener('click', () => adjustTime(30));
decreaseBtn.addEventListener('click', () => adjustTime(-30));
playPauseBtn.addEventListener('click', () => toggleTimer());

// Initialize display
updateDisplay();
