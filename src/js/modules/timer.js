/**
 * Timer Module - Pomodoro timer logic
 */

import {
    TIMER_DURATIONS,
    MODE_NAMES,
    POMODORO_CONFIG,
    DAYS_MAPPING
} from '../../config/constants.js';
import { saveState, saveWeeklyData } from './storage.js';

let time;
let defaultTime;
let running = false;
let startTime;
let duration;
let mode = 'pomodoro';
let cycleCount = 0;
let pomodoroCount = 0;
let weeklyData;

let onTickHandler = null;
let onCycleCompleteHandler = null;

export function initTimer(initialWeeklyData) {
    weeklyData = initialWeeklyData;
    setMode('pomodoro');
}

export function setTickHandler(handler) {
    onTickHandler = handler;
}

export function setCycleCompleteHandler(handler) {
    onCycleCompleteHandler = handler;
}

export function getTimerState() {
    return {
        time,
        defaultTime,
        mode,
        cycleCount,
        pomodoroCount,
        running,
        weeklyData: { ...weeklyData }
    };
}

export function setTimerState(state) {
    time = state.time;
    defaultTime = state.defaultTime;
    mode = state.mode;
    cycleCount = state.cycleCount;
    pomodoroCount = state.pomodoroCount;
    weeklyData = state.weeklyData ? { ...state.weeklyData } : weeklyData;
}

export function getDayOfWeek() {
    const date = new Date();
    return DAYS_MAPPING[date.getDay()];
}

function tick() {
    if (!running) return;

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(duration - elapsed, 0);
    time = Math.ceil(remaining / 1000);

    if (onTickHandler) {
        onTickHandler(time, mode);
    }

    if (remaining <= 0) {
        running = false;
        handleCycle();
    } else {
        requestAnimationFrame(tick);
    }
}

export function startTimer() {
    if (running) return;
    running = true;

    duration = time * 1000;
    startTime = Date.now();
    tick();
}

export function pauseTimer() {
    running = false;
    saveTimerState();
}

export function resetTimer() {
    running = false;
    setMode(mode);
}

export function setMode(selectedMode) {
    running = false;
    mode = selectedMode;
    defaultTime = TIMER_DURATIONS[mode];
    time = defaultTime;

    if (onTickHandler) {
        onTickHandler(time, mode);
    }
}

function handleCycle() {
    if (mode === 'pomodoro') {
        pomodoroCount++;

        const today = getDayOfWeek();
        weeklyData[today] = (weeklyData[today] || 0) + (TIMER_DURATIONS.pomodoro / 60);

        if (pomodoroCount % POMODORO_CONFIG.maxPomodoros === 0) {
            if (onCycleCompleteHandler) {
                onCycleCompleteHandler("Complete cycle! Time for a Long Break 🌴");
            }
            setMode('long_break');
        } else {
            if (onCycleCompleteHandler) {
                onCycleCompleteHandler("Pomodoro completed! Time for a Short Break ☕");
            }
            setMode('short_break');
        }
    } else {
        if (onCycleCompleteHandler) {
            onCycleCompleteHandler("Break completed! Time for a Pomodoro 🍅");
        }

        if (mode === 'long_break') {
            cycleCount++;
            pomodoroCount = 0;
        }
        setMode('pomodoro');
    }

    duration = time * 1000;
    startTime = Date.now();
    running = true;
    tick();

    saveTimerState();
    saveWeeklyData(weeklyData);
}

export function isRunning() {
    return running;
}

export function getMode() {
    return mode;
}

export function getPomodoroCount() {
    return pomodoroCount;
}

export function getCycleCount() {
    return cycleCount;
}

export function getWeeklyData() {
    return { ...weeklyData };
}

export function setWeeklyData(data) {
    weeklyData = { ...data };
}

export function getCurrentTime() {
    return time;
}

function saveTimerState() {
    saveState({
        mode,
        time,
        defaultTime,
        pomodoroCount,
        cycleCount,
        theme: document.body.classList.contains("animate-moon")
    });
}

export function toggleTimer() {
    if (running) {
        pauseTimer();
    } else {
        startTimer();
    }
    return running;
}

export function handleVisibilityChange() {
    if (!document.hidden && running) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(duration - elapsed, 0);
        time = Math.ceil(remaining / 1000);
        if (onTickHandler) {
            onTickHandler(time, mode);
        }
    }
}

export function setupSyncInterval() {
    return setInterval(() => {
        if (running) {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(duration - elapsed, 0);
            time = Math.ceil(remaining / 1000);
            if (onTickHandler) {
                onTickHandler(time, mode);
            }
        }
    }, 500);
}
