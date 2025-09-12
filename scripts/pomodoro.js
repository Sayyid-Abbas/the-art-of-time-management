let minutes = 0, seconds = 0;
let timerInterval;
let running = false;
let mode = "work";
let sessionCount = 1;
let endTime = null;

function saveSettings() {
  localStorage.setItem("pomodoro_workTime", document.getElementById("workTime").value);
  localStorage.setItem("pomodoro_shortBreak", document.getElementById("shortBreak").value);
  localStorage.setItem("pomodoro_longBreak", document.getElementById("longBreak").value);
  localStorage.setItem("pomodoro_mode", mode);
  localStorage.setItem("pomodoro_sessionCount", sessionCount);
  localStorage.setItem("pomodoro_minutes", minutes);
  localStorage.setItem("pomodoro_seconds", seconds);
  if (endTime) {
    localStorage.setItem("pomodoro_endTime", endTime);
  } else {
    localStorage.removeItem("pomodoro_endTime"); 
  }
}

document.getElementById("workTime").addEventListener("change", () => {
  localStorage.setItem("pomodoro_workTime", document.getElementById("workTime").value);
  if (!running && mode === "work") {
    minutes = parseInt(document.getElementById("workTime").value);
    seconds = 0;
    endTime = null;
    updateDisplay();
  }
});

document.getElementById("shortBreak").addEventListener("change", () => {
  localStorage.setItem("pomodoro_shortBreak", document.getElementById("shortBreak").value);
  if (!running && mode === "short") {
    minutes = parseInt(document.getElementById("shortBreak").value);
    seconds = 0;
    endTime = null;
    updateDisplay();
  }
});

document.getElementById("longBreak").addEventListener("change", () => {
  localStorage.setItem("pomodoro_longBreak", document.getElementById("longBreak").value);
  if (!running && mode === "long") {
    minutes = parseInt(document.getElementById("longBreak").value);
    seconds = 0;
    endTime = null;
    updateDisplay();
  }
});

function loadSettings() {
  const workTime = localStorage.getItem("pomodoro_workTime");
  const shortBreak = localStorage.getItem("pomodoro_shortBreak");
  const longBreak = localStorage.getItem("pomodoro_longBreak");

  if (workTime) document.getElementById("workTime").value = workTime;
  if (shortBreak) document.getElementById("shortBreak").value = shortBreak;
  if (longBreak) document.getElementById("longBreak").value = longBreak;

  if (localStorage.getItem("pomodoro_mode")) {
    mode = localStorage.getItem("pomodoro_mode");
  }
  if (localStorage.getItem("pomodoro_sessionCount")) {
    sessionCount = parseInt(localStorage.getItem("pomodoro_sessionCount"));
  }

  if (localStorage.getItem("pomodoro_minutes")) {
    minutes = parseInt(localStorage.getItem("pomodoro_minutes"));
    seconds = parseInt(localStorage.getItem("pomodoro_seconds"));
  }
}

function updateDisplay() {
  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById("sessionCount").textContent = sessionCount;

  if (mode === "work") {
    document.getElementById("status").textContent = "وضع العمل";
  } else if (mode === "short") {
    document.getElementById("status").textContent = "استراحة قصيرة";
  } else {
    document.getElementById("status").textContent = "استراحة طويلة";
  }
}

function startMode(newMode) {
  mode = newMode;

  if (mode === "work") {
    minutes = parseInt(document.getElementById("workTime").value);
  } else if (mode === "short") {
    minutes = parseInt(document.getElementById("shortBreak").value);
  } else {
    minutes = parseInt(document.getElementById("longBreak").value);
  }

  seconds = 0;
  endTime = null;
  updateDisplay();
  saveSettings();
}

function notifyEnd() {
  console.log("🔔 Session ended!");
}

function tick() {
  const now = Date.now();
  let remaining = Math.floor((endTime - now) / 1000);
  if (remaining < 0) remaining = 0;

  minutes = Math.floor(remaining / 60);
  seconds = remaining % 60;
  updateDisplay();

  if (remaining <= 0) {
    clearInterval(timerInterval);
    running = false;
    notifyEnd();
    localStorage.removeItem("pomodoro_endTime");

    if (mode === "work") {
      sessionCount++;
      localStorage.setItem("pomodoro_sessionCount", sessionCount);

      if (sessionCount % 4 === 0) {
        startMode("long");
      } else {
        startMode("short");
      }

    } else if (mode === "long") {
      sessionCount = 1; 
      localStorage.setItem("pomodoro_sessionCount", sessionCount);
      startMode("work");

    } else {
      startMode("work");
    }

    updateDisplay(); 
    startTimer();
  }
}

let startButton = document.querySelector(".start");
let stopButton = document.querySelector(".stop");
let resetButton = document.querySelector(".reset");

startButton.onclick = startTimer;
stopButton.onclick = pauseTimer; 
resetButton.onclick = resetTimer;

function startTimer() {
  if (!running) {
    clearInterval(timerInterval);
    const now = Date.now();

    if (!endTime) {
      endTime = now + (minutes * 60 + seconds) * 1000;
    }

    running = true;
    saveSettings();
    timerInterval = setInterval(tick, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  running = false;
  endTime = null; 
  saveSettings();
}

function resetTimer() {
  clearInterval(timerInterval);
  running = false;
  sessionCount = 1;
  endTime = null;
  mode = "work";
  localStorage.clear();
  startMode("work");
}


loadSettings();

const storedEndTime = localStorage.getItem("pomodoro_endTime");
if (storedEndTime) {
  endTime = parseInt(storedEndTime);
  const now = Date.now();
  if (endTime > now) {
    running = true;
    tick();
    timerInterval = setInterval(tick, 1000);
  } else {
    localStorage.removeItem("pomodoro_endTime");
    startMode(mode);
  }
} else {
  startMode(mode);
}
