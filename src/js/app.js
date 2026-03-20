/**
 * Main Application File - Hora App
 * Initializes all modules and manages event listeners
 */

import * as Timer from './modules/timer.js';
import * as Tasks from './modules/tasks.js';
import * as Theme from './modules/theme.js';
import * as Chart from './modules/chart.js';
import * as UI from './modules/ui.js';
import { loadState, loadWeeklyData } from './modules/storage.js';
import { INITIAL_WEEKLY_DATA } from '../config/constants.js';

function initializeApp() {
    const savedState = loadState();
    let weeklyData = loadWeeklyData();

    Timer.initTimer(weeklyData);

    if (savedState) {
        Timer.setTimerState({
            time: savedState.time || 25 * 60,
            defaultTime: savedState.defaultTime || 25 * 60,
            mode: savedState.mode || 'pomodoro',
            cycleCount: savedState.cycleCount || 0,
            pomodoroCount: savedState.pomodoroCount || 0,
            weeklyData: weeklyData
        });

        Tasks.setTaskList(savedState.taskList || []);
    } else {
        Tasks.setTaskList([]);
    }

    Theme.initTheme(savedState?.theme || false);

    const timerState = Timer.getTimerState();

    UI.updateTimerDisplay(timerState.time, timerState.mode);
    UI.updateModeDisplay(timerState.mode);
    UI.updatePomodoroCount(timerState.pomodoroCount);
    UI.updateCycleCount(timerState.cycleCount);
    UI.updateResponsiveButtonText();
    UI.hideResetButton();

    Tasks.renderTasks();
    Chart.renderChart(timerState.weeklyData);

    Timer.setTickHandler((time, mode) => {
        UI.updateTimerDisplay(time, mode);
    });

    Timer.setCycleCompleteHandler((message) => {
        UI.notifyUser(message);
        const newState = Timer.getTimerState();
        UI.updatePomodoroCount(newState.pomodoroCount);
        UI.updateCycleCount(newState.cycleCount);
        UI.updateModeDisplay(newState.mode);
        Chart.renderChart(newState.weeklyData);
        UI.updatePlayButtonState(true);   
    });

    Theme.setThemeChangeHandler(() => {
        Chart.renderChart(Timer.getTimerState().weeklyData);
    });
}

function setupEventListeners() {
    const themeSwitch = document.getElementById("switch-sun-moon");
    if (themeSwitch) {
        themeSwitch.addEventListener("change", () => {
            Theme.toggleTheme();
        });
        themeSwitch.checked = Theme.isDarkTheme();
    }

    const playButton = document.querySelector(".btn-flip");
    if (playButton) {
        playButton.addEventListener("click", async () => {
            if (Notification.permission !== "granted") {
                await Notification.requestPermission();
            }
            const isPlaying = Timer.toggleTimer();
            UI.updatePlayButtonState(isPlaying);

            if (isPlaying) {
                UI.showResetButton();
            }
        });
    }

    const resetButton = document.querySelector(".material-symbols-outlined");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            Timer.resetTimer();
            UI.updatePlayButtonState(false);
            UI.hideResetButton();
            const state = Timer.getTimerState();
            UI.updateTimerDisplay(state.time, state.mode);
            UI.updateModeDisplay(state.mode);
        });
    }

    const modeButtons = document.querySelectorAll(".mode");
    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedMode = btn.dataset.mode;
            UI.setModeWithFadeAnimation(selectedMode, () => {
                Timer.setMode(selectedMode);
                const state = Timer.getTimerState();
                UI.updateTimerDisplay(state.time, state.mode);
                UI.updateModeDisplay(state.mode);
                UI.updatePlayButtonState(false);
                UI.hideResetButton();
            });
        });
    });

    const addTaskBtn = document.querySelector(".task-input button");
    const taskInput = document.getElementById("newTask");

    if (addTaskBtn && taskInput) {
        const handleAddTask = () => {
            const taskText = taskInput.value.trim();
            if (Tasks.addTask(taskText)) {
                taskInput.value = "";
                Tasks.renderTasks();
            }
        };

        addTaskBtn.addEventListener("click", handleAddTask);
        taskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleAddTask();
            }
        });
    }

    window.addEventListener("resize", UI.updateResponsiveButtonText);

    // Visibility change handler
    document.addEventListener("visibilitychange", () => {
        Timer.handleVisibilityChange();
    });

    // Setup sync interval
    Timer.setupSyncInterval();
}

// ===== APP START =====

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    setupEventListeners();
});
