
let minutes, seconds = 0;
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
  if (endTime) {
    localStorage.setItem("pomodoro_endTime", endTime);
  }
}

function loadSettings() {
  if (localStorage.getItem("pomodoro_workTime")) {
    document.getElementById("workTime").value = localStorage.getItem("pomodoro_workTime");
    document.getElementById("shortBreak").value = localStorage.getItem("pomodoro_shortBreak");
    document.getElementById("longBreak").value = localStorage.getItem("pomodoro_longBreak");
  }
  if (localStorage.getItem("pomodoro_mode")) {
    mode = localStorage.getItem("pomodoro_mode");
  }
  if (localStorage.getItem("pomodoro_sessionCount")) {
    sessionCount = parseInt(localStorage.getItem("pomodoro_sessionCount"));
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
  updateDisplay();
  endTime = Date.now() + (minutes * 60 + seconds) * 1000;
  saveSettings();
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
    alert("انتهت الجلسة!");
    localStorage.removeItem("pomodoro_endTime");
    
    if (mode === "work") {
      if (sessionCount % 4 === 0) {
        startMode("long");
      } else {
        startMode("short");
      }
    } else {
      if (mode === "short") {
        sessionCount++;
        localStorage.setItem("pomodoro_sessionCount", sessionCount); 
        startMode("work");
      } else if (mode === "long") {
        sessionCount = 1;
        localStorage.setItem("pomodoro_sessionCount", sessionCount); 
        startMode("work");
      }
    }
    updateDisplay(); 
    startTimer();
  }
}


let startButton = document.querySelector(".start");
let stopButton = document.querySelector(".stop");
let resetButton = document.querySelector(".reset");
let resumeButton = document.querySelector(".resume");

startButton.onclick = startTimer;
stopButton.onclick = pauseTimer; 
resetButton.onclick = resetTimer;
resumeButton.onclick = resumeTimer;


function startTimer() {
  if (!running) {
    const now = Date.now();
    if (!endTime || endTime < now) {
      endTime = now + (minutes * 60 + seconds) * 1000;
      saveSettings();
    }
    running = true;
    timerInterval = setInterval(tick, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  running = false;
  saveSettings();
}

function resetTimer() {
  clearInterval(timerInterval);
  running = false;
  sessionCount = 1;
  endTime = null;
  localStorage.removeItem("pomodoro_endTime");
  localStorage.removeItem("pomodoro_sessionCount");
  localStorage.removeItem("pomodoro_mode");
  saveSettings();
  startMode("work");
}

function resumeTimer() {
  if (!running) {
    const storedEnd = localStorage.getItem("pomodoro_endTime");
    if (storedEnd) {
      endTime = parseInt(storedEnd);
      const now = Date.now();
      if (endTime > now) {
        running = true;
        timerInterval = setInterval(tick, 1000);
      } else {
        alert("انتهى الوقت أثناء غيابك، يرجى إعادة الضبط.");
        resetTimer();
      }
    } else {
      alert("لا يوجد وقت محفوظ للاستئناف، يرجى البدء.");
    }
  }
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