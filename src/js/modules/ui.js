/**
 * UI Module - User interface management
 */

import { MODE_NAMES, AUDIO_CONFIG } from '../../config/constants.js';

const alertSound = new Audio(AUDIO_CONFIG.notification);
alertSound.volume = AUDIO_CONFIG.volume;

export function updateTimerDisplay(time, mode) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formatted =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    const timerElement = document.querySelector("#timer");
    if (timerElement) {
        timerElement.textContent = formatted;
    }

    document.title = `${formatted} - ${MODE_NAMES[mode]}`;
}

export function updateModeDisplay(mode) {
    const buttons = document.querySelectorAll(".mode");
    buttons.forEach(btn => btn.classList.remove("active"));

    const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (targetBtn) {
        targetBtn.classList.add("active");
    }
}

export function setModeWithFadeAnimation(mode, callback) {
    const display = document.getElementById("timer");
    if (display) {
        display.classList.add("fade");
        setTimeout(() => {
            updateModeDisplay(mode);
            if (callback) callback();
            display.classList.remove("fade");
        }, 200);
    } else if (callback) {
        callback();
    }
}

export function hideResetButton() {
    const resetBtn = document.querySelector(".material-symbols-outlined");
    if (resetBtn) resetBtn.style.visibility = "hidden";
}

export function showResetButton() {
    const resetBtn = document.querySelector(".material-symbols-outlined");
    if (resetBtn) resetBtn.style.visibility = "visible";
}

export function updatePlayButtonState(isPlaying) {
    const playBtn = document.querySelector(".btn-flip");
    if (playBtn) {
        if (isPlaying) {
            playBtn.classList.add("active");
        } else {
            playBtn.classList.remove("active");
        }
    }
}

export function updatePomodoroCount(count) {
    const element = document.getElementById("pomodoroCount");
    if (element) {
        element.innerText = count;
    }
}

export function updateCycleCount(count) {
    const element = document.getElementById("cycleCount");
    if (element) {
        element.innerText = count;
    }
}

export function updateResponsiveButtonText() {
    const isMobile = window.innerWidth <= 425;
    const modesBtns = document.querySelectorAll(".mode");

    modesBtns.forEach(btn => {
        btn.textContent = isMobile ? btn.dataset.short : btn.dataset.full;
    });
}

export async function notifyUser(message) {
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
        const notification = new Notification("Pomodoro Timer 🍅", {
            body: message,
            tag: "pomodoro",
            renotify: true,
            silent: false
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        }
    }
    alertSound.play().catch(err => console.log(err));
}
