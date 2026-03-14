// ===== Pomodoro Timer =====
let time;
let defaultTime;
let timer;
let running = false;
let startTime;
let duration;

let mode = 'pomodoro';
let cycleCount = 0;
let pomodoroCount = 0;
const maxPomodoros = 4;

const times = {
    pomodoro: 25,
    short_break: 5,
    long_break: 15
};

const modeNames = {
    pomodoro: "Pomodoro 🍅",
    short_break: "Short Break ☕",
    long_break: "Long Break 🌴"
};


let weeklyData = {
  "Sun": 0,
  "Mon": 0,
  "Tue": 0,
  "Wed": 0,
  "Thu": 0,
  "Fri": 0,
  "Sat": 0
};

const themeSwitch = document.getElementById("switch-sun-moon");

const alertSound = new Audio("assets/sounds/universfield-new-notification-048-494235.mp3");
alertSound.volume = 0.3;

let lastSave = 0;

function saveState(){
    const now = Date.now();
    if(now - lastSave < 5000) return;
    lastSave = now;

    const state = {
        mode,
        time,
        defaultTime,
        pomodoroCount,
        taskList,
        cycleCount,
        theme: document.body.classList.contains("animate-moon")
    };

    localStorage.setItem('pomodoroState', JSON.stringify(state));
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
}

function loadState() {
    const saved = localStorage.getItem('pomodoroState');
    if(saved){
        const state = JSON.parse(saved);
        mode = state.mode || 'pomodoro';
        time = state.time || times[mode]*60;
        defaultTime = state.defaultTime || times[mode]*60;
        pomodoroCount = state.pomodoroCount || 0;
        taskList = state.taskList || [];
        cycleCount = state.cycleCount || 0;
        if (state.theme) {
            document.body.classList.add("animate-moon");
            themeSwitch.checked = true;
        }
        // setMode(mode);
    }else{
        time = times[mode]*60;
        defaultTime = times[mode]*60;
        taskList = [];
        cycleCount = 0;
    }
    
    const savedWeeklyData = localStorage.getItem('weeklyData');
    if(savedWeeklyData){
        weeklyData = JSON.parse(savedWeeklyData);
    }
}

// ===== Weekly Data and Chart =====
const daysMapping = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat"
};

function getDayOfWeek() {
    const date = new Date();
    return daysMapping[date.getDay()];
}

function isDarkTheme() {
    const state = JSON.parse(localStorage.getItem('pomodoroState'));
    return state?.theme;
}

let chart = null;

function renderChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    if (chart) {
        chart.destroy();
    }

    const dark = isDarkTheme();
    const tickColor = dark ? "#F1F5F9" : "#1F2937";

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(weeklyData),
            datasets: [{
                label: 'Pomodoro hours',
                data: Object.values(weeklyData),
                backgroundColor: [
                    'rgba(241,245,249,0.9)',
                ],
                borderColor: [
                    '#B2BEC3',
                ],
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#FFFFFF',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleColor: 'inherit',
                    bodyColor: 'inherit',
                    callbacks: {
                        label: function(context) {
                            const hours = context.parsed.y;
                            const pomodoros = (hours / (times.pomodoro / 60)).toFixed(0);
                            return hours.toFixed(2) + 'h (' + pomodoros + ' Pomodoros)';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    
                    ticks: {
                        color: tickColor,
                        callback: function(value) {
                            return value + 'h';
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: tickColor,
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

function updateDisplay(){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    const formatted =
        String(minutes).padStart(2,"0") + ":" +
        String(seconds).padStart(2,"0");

    document.querySelector("#timer").textContent = formatted;
    document.title = `${formatted} - ${modeNames[mode]}`;
    saveState();
}

function tick(){
    if(!running) return;

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(duration - elapsed, 0);
    time = Math.ceil(remaining / 1000);
    updateDisplay();

    if(remaining <= 0){
        running = false;
        alertSound.play();
        handleCycle();
    } else {
        requestAnimationFrame(tick);
    }
}

function startTimer(){
    const resetBtn = document.querySelector(".material-symbols-outlined");
    if(resetBtn) resetBtn.style.visibility = "visible";

    if(running) return;
    running = true;

    duration = time * 1000;
    startTime = Date.now();
    tick();
}

function pauseTimer(){
    running = false;
    saveState();
}

function resetTimer(){
    const playBtn = document.querySelector(".btn-flip");
    if (playBtn) playBtn.classList.remove("active");
    const resetBtn = document.querySelector(".material-symbols-outlined");
    if (resetBtn) resetBtn.style.visibility = "hidden";

    clearInterval(timer);
    running = false;
    setMode(mode);
}

function setMode(selectedMode){
    const buttons = document.querySelectorAll(".mode");
    buttons.forEach(btn => btn.classList.remove("active"));
    
    const targetBtn = document.querySelector(`[data-mode="${selectedMode}"]`);
    if (targetBtn) targetBtn.classList.add("active");
    
    clearInterval(timer);
    running = false;
    mode = selectedMode;

    const display = document.getElementById("timer");
    display.classList.add("fade");
    setTimeout(() => {
        defaultTime = times[mode] * 60;
        time = defaultTime; updateDisplay();
        display.classList.remove("fade");
    }, 200);

    defaultTime = times[mode] * 60;
    time = defaultTime;
    updateDisplay();
}

function handleCycle(){
    pauseTimer();

    if(mode === 'pomodoro'){
        pomodoroCount++;
        document.getElementById("pomodoroCount").innerText = pomodoroCount;

        const today = getDayOfWeek();
        weeklyData[today] = (weeklyData[today] || 0) + (times.pomodoro / 60);

        if(pomodoroCount % maxPomodoros === 0){
            notifyUser("Complete cycle! Time for a Long Break 🌴");
            setMode('long_break');
        }else{
            notifyUser("Pomodoro completed! Time for a Short Break ☕");
            setMode('short_break');
        }
    }else{
        notifyUser("Break completed! Time for a Pomodoro 🍅");
        if(mode === 'long_break'){
            cycleCount++;
            pomodoroCount = 0;
            document.getElementById("pomodoroCount").innerText = pomodoroCount;
            document.getElementById("cycleCount").innerText = cycleCount;
        }
        setMode('pomodoro');
    }

    duration = time * 1000;
    startTime = Date.now();
    running = true;
    tick();

    saveState();
    renderChart();
}

function notifyUser(message){
    if(Notification.permission === "default"){
        Notification.requestPermission();
    }

    alertSound.play().catch(e => console.log("Sound blocked in the background"));

    if(Notification.permission === "granted"){
        new Notification("Pomodoro Timer", {
            body: message,
        });
    }
}

// ===== to-do list =====
let taskList = [];

function addTask(){
    let taskInput = document.getElementById("newTask");
    let taskText = taskInput.value.trim();
    if(taskText === "") return;
    let task = { text: taskText, completed: false };
    taskList.push(task);
    taskInput.value = "";
    renderTasks();
    saveState();
}

function toggleTask(index){
    taskList[index].completed = !taskList[index].completed;
    const li = document.querySelector(`#taskList li:nth-child(${index + 1})`);
    if (li) {
        li.classList.toggle('completed');
        const input = li.querySelector('input');
        input.checked = taskList[index].completed;
    }
    saveState();
}

function deleteTask(index){
    taskList.splice(index,1);
    renderTasks();
    saveState();
}

function renderTasks() {
    const ul = document.getElementById("taskList");
    ul.innerHTML = "";

    taskList.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add('completed');
        }
        const taskId = `task-${index}`;

        li.innerHTML = `
            <div class="checkbox-wrapper">
                <label for="${taskId}" class="item">
                    <input type="checkbox" id="${taskId}" class="hidden" />
                    <label for="${taskId}" class="checkbox">
                        <svg viewBox="0 0 14 12">
                            <polyline points="1 7.6 5 11 13 1"></polyline>
                        </svg>
                    </label>
                    <label for="${taskId}" class="checkbox-label">${task.text}</label>
                </label>
                <button class="delete-btn">❌</button>
            </div>
        `;
        ul.appendChild(li);

        const checkbox = li.querySelector(`#${taskId}`);
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(index));

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(index));
    });
}

// Initialization
loadState();
updateDisplay();
renderTasks();
document.getElementById("pomodoroCount").innerText = pomodoroCount;
document.getElementById("cycleCount").innerText = cycleCount;

renderChart();

themeSwitch.addEventListener("change", () => {
    document.body.classList.remove("animate-sun", "animate-moon");
    
    if(themeSwitch.checked){
        document.body.classList.add("animate-moon");
        saveState();
        renderChart();
    } else {
        document.body.classList.add("animate-sun");
        saveState();
        renderChart();
    }
});

function toggleTimer(event) {
    const btn = event ? event.currentTarget : document.querySelector(".btn-flip");

    if (!btn) return;

    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
        startTimer();
    } else {
        pauseTimer();
    }
}

document.querySelectorAll(".btn-flip").forEach(btn => {
    btn.addEventListener("click", toggleTimer);
});

document.addEventListener("visibilitychange", () => {
    if(!document.hidden && running){
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(duration - elapsed, 0);
        time = Math.ceil(remaining / 1000);
        updateDisplay();
    }
});

setInterval(() => {
    if(running){
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(duration - elapsed, 0);
        time = Math.ceil(remaining / 1000);
        updateDisplay();
    }
}, 500);