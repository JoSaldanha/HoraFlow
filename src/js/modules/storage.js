/**
 * Storage Module - Persistent data management
 */

import {
    TIMER_DURATIONS,
    POMODORO_CONFIG,
    INITIAL_WEEKLY_DATA
} from '../../config/constants.js';

let lastSave = 0;

export function saveState(state) {
    const now = Date.now();
    if (now - lastSave < 5000) return;
    lastSave = now;

    localStorage.setItem(POMODORO_CONFIG.storageKey, JSON.stringify(state));
}

export function loadState() {
    const saved = localStorage.getItem(POMODORO_CONFIG.storageKey);

    if (saved) {
        return JSON.parse(saved);
    }

    return null;
}

export function saveWeeklyData(weeklyData) {
    localStorage.setItem(POMODORO_CONFIG.weeklyDataKey, JSON.stringify(weeklyData));
}

export function loadWeeklyData() {
    const saved = localStorage.getItem(POMODORO_CONFIG.weeklyDataKey);

    if (saved) {
        return JSON.parse(saved);
    }

    return { ...INITIAL_WEEKLY_DATA };
}

export function getStoredTheme() {
    const state = loadState();
    return state?.theme || false;
}
