/**
 * Theme Module - Light/dark theme management
 */

import { THEME } from '../../config/constants.js';
import { saveState } from './storage.js';

let currentTheme = 'sun';
let onThemeChangeHandler = null;

export function initTheme(isDarkTheme) {
    currentTheme = isDarkTheme ? 'moon' : 'sun';
    applyTheme(currentTheme);
}

export function setThemeChangeHandler(handler) {
    onThemeChangeHandler = handler;
}

export function applyTheme(theme) {
    currentTheme = theme;
    document.body.classList.remove(THEME.sun, THEME.moon);

    if (theme === 'moon') {
        document.body.classList.add(THEME.moon);
    } else {
        document.body.classList.add(THEME.sun);
    }
}

export function toggleTheme() {
    const newTheme = currentTheme === 'sun' ? 'moon' : 'sun';
    applyTheme(newTheme);

    saveState({
        theme: newTheme === 'moon'
    });

    if (onThemeChangeHandler) {
        onThemeChangeHandler();
    }
}

export function isDarkTheme() {
    return currentTheme === 'moon';
}

export function getCurrentTheme() {
    return currentTheme;
}
