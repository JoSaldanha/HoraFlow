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

const themeSwitch = document.getElementById("switch-sun-moon");

const alertSound = new Audio("assets/sounds/universfield-new-notification-048-494235.mp3");
alertSound.volume = 0.3;

function saveState() {
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

themeSwitch.addEventListener("change", () => {
    document.body.classList.remove("animate-sun", "animate-moon"); // reset
    
    if(themeSwitch.checked){
        document.body.classList.add("animate-moon");
    } else {
        document.body.classList.add("animate-sun");
    }
});
