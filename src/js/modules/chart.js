/**
 * Chart Module - Weekly chart management
 */

import { TIMER_DURATIONS, CHART_CONFIG, CHART_COLORS } from '../../config/constants.js';
import { isDarkTheme } from './theme.js';

let chart = null;
let minutesToHours = false;

export function renderChart(weeklyData) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    if (chart) {
        chart.destroy();
    }

    const dark = isDarkTheme();
    const colors = dark ? CHART_COLORS.dark : CHART_COLORS.light;

    chart = new Chart(ctx, {
        type: CHART_CONFIG.type,
        data: {
            labels: Object.keys(weeklyData),
            datasets: [{
                label: 'Pomodoro time',
                data: Object.values(weeklyData),
                backgroundColor: [colors.bar],
                borderColor: [colors.border],
                borderWidth: 2,
                borderRadius: CHART_CONFIG.borderRadius,
                hoverBackgroundColor: colors.hover,
            }]
        },
        options: {
            responsive: CHART_CONFIG.responsive,
            maintainAspectRatio: CHART_CONFIG.maintainAspectRatio,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: CHART_CONFIG.tooltipPadding,
                    titleColor: 'inherit',
                    bodyColor: 'inherit',
                    callbacks: {
                        label: function(context) {
                            let time = context.parsed.y;
                            if (time >= 60) {
                              time = time / 60;
                              minutesToHours = true;
                            }
                            let timeConvert = time >= 60 ? (time / 60).toFixed(2) + 'h' : time.toFixed(2) + 'min';
                            const pomodoros = (context.parsed.y / (TIMER_DURATIONS.pomodoro / 60)).toFixed(0);
                            return timeConvert + ' (' + pomodoros + ' Pomodoros)';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: colors.tick,
                        callback: function(value) {
                            return value + (minutesToHours ? 'h' : 'min');
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: colors.tick,
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

export function destroyChart() {
    if (chart) {
        chart.destroy();
        chart = null;
    }
}
