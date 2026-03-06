// ===== Pomodoro Timer =====
let time;
let defaultTime;
let timer;
let running = false;

let mode = 'pomodoro';
let cycleCount = 0;
let pomodoroCount = 0;
const maxPomodoros = 4;

const times = {
    pomodoro: 0.1,
    short: 0.1,
    long: 0.1
};

const alertSound = new Audio("assets/sounds/universfield-new-notification-048-494235.mp3");
alertSound.volume = 0.3;

function saveState() {
    const state = {
        mode,
        time,
        defaultTime,
        pomodoroCount,
        taskList,
        cycleCount
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
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
    }else{
        time = times[mode]*60;
        defaultTime = times[mode]*60;
        taskList = [];
        cycleCount = 0;
    }
}

function updateDisplay(){
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerText = minutes + ":" + seconds;
    saveState();
}

function startTimer(){
    if(running) return;
    running = true;
    timer = setInterval(()=>{
        if(time > 0){
            time--;
            updateDisplay();
        }else{
            clearInterval(timer);
            running = false;
            alertSound.play();
            handleCycle();
        }
    },1000);
}

function pauseTimer(){
    clearInterval(timer);
    running = false;
    saveState();
}

function resetTimer(){
    clearInterval(timer);
    running = false;
    setMode(mode);
}

function setMode(selectedMode){
    clearInterval(timer);
    running = false;
    mode = selectedMode;

    defaultTime = times[mode] * 60;
    time = defaultTime;
    updateDisplay();
}

function handleCycle(){
    if(mode === 'pomodoro'){
        pomodoroCount++;
        document.getElementById("pomodoroCount").innerText = pomodoroCount;

        if(pomodoroCount % maxPomodoros === 0){
            alert("Complete cycle! Time for a Long Break 🌴");
            setMode('long');
        }else{
            alert("Pomodoro completed! Time for a Short Break ☕");
            setMode('short');
        }
    }else{
        alert("Break completed! Time for a Pomodoro 🍅");
        if(mode === 'long'){
          cycleCount++;
          pomodoroCount = 0;
          document.getElementById("pomodoroCount").innerText = pomodoroCount;
          document.getElementById("cycleCount").innerText = cycleCount;
        }
        setMode('pomodoro');
    }

    startTimer();
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
    renderTasks();
    saveState();
}

function deleteTask(index){
    taskList.splice(index,1);
    renderTasks();
    saveState();
}

function renderTasks(){
    let ul = document.getElementById("taskList");
    ul.innerHTML = "";
    taskList.forEach((task, index)=>{
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
            <span>${task.text}</span>
            <button onclick="deleteTask(${index})">❌</button>
        `;
        ul.appendChild(li);
    });
}

// Initialization
loadState();
updateDisplay();
renderTasks();
document.getElementById("pomodoroCount").innerText = pomodoroCount;
document.getElementById("cycleCount").innerText = cycleCount;