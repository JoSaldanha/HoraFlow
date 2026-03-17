/**
 * Tasks Module - Task management
 */

import { saveState } from './storage.js';

let taskList = [];

export function getTaskList() {
    return [...taskList];
}

export function setTaskList(tasks) {
    taskList = [...tasks];
}

export function addTask(taskText) {
    if (!taskText.trim()) return false;

    const task = { text: taskText.trim(), completed: false };
    taskList.push(task);
    return true;
}

export function toggleTask(index) {
    if (index >= 0 && index < taskList.length) {
        taskList[index].completed = !taskList[index].completed;
        return true;
    }
    return false;
}

export function deleteTask(index) {
    if (index >= 0 && index < taskList.length) {
        taskList.splice(index, 1);
        return true;
    }
    return false;
}

export function renderTasks(onRenderComplete) {
    const ul = document.getElementById("taskList");
    if (!ul) return;

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
        checkbox.addEventListener("change", () => {
            toggleTask(index);
            renderTasks(onRenderComplete);
            saveTaskState();
        });

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            deleteTask(index);
            renderTasks(onRenderComplete);
            saveTaskState();
        });
    });

    if (onRenderComplete) {
        onRenderComplete();
    }
}

function saveTaskState() {
    saveState({
        taskList,
        theme: document.body.classList.contains("animate-moon")
    });
}
