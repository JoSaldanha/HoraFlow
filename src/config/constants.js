/**
 * Global Configuration - Hora App
 * Centralize all constants and settings here
 */

// Timer durations in seconds
export const TIMER_DURATIONS = {
    pomodoro: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
};

// UI display labels
export const MODE_NAMES = {
    pomodoro: "Pomodoro 🍅",
    short_break: "Short Break ☕",
    long_break: "Long Break 🌴"
};

export const MODE_LABELS = {
    pomodoro: { full: "Pomodoro", short: "Pomo" },
    short_break: { full: "Short Break", short: "Short" },
    long_break: { full: "Long Break", short: "Long" }
};

// Audio configuration
export const AUDIO_CONFIG = {
    notification: "../../assets/sounds/universfield-new-notification-048-494235.mp3",
    volume: 0.3
};

// Pomodoro settings
export const POMODORO_CONFIG = {
    maxPomodoros: 4,
    storageKey: 'pomodoroState',
    weeklyDataKey: 'weeklyData'
};

// Week days mapping
export const DAYS_MAPPING = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat"
};

// Theme classes
export const THEME = {
    sun: 'animate-sun',
    moon: 'animate-moon',
    storageKey: 'theme'
};

// Initial weekly data structure
export const INITIAL_WEEKLY_DATA = {
    "Sun": 0,
    "Mon": 0,
    "Tue": 0,
    "Wed": 0,
    "Thu": 0,
    "Fri": 0,
    "Sat": 0
};

// Chart.js configuration
export const CHART_CONFIG = {
    type: 'bar',
    responsive: true,
    maintainAspectRatio: true,
    borderRadius: 8,
    tooltipPadding: 12
};

export const CHART_COLORS = {
    light: {
        bar: 'rgba(241,245,249,0.9)',
        border: '#B2BEC3',
        hover: '#FFFFFF',
        tick: '#1F2937'
    },
    dark: {
        bar: 'rgba(241,245,249,0.9)',
        border: '#B2BEC3',
        hover: '#FFFFFF',
        tick: '#F1F5F9'
    }
};
