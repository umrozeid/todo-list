let tasks = [];
let textarea = document.getElementById('add-task');
let container = document.getElementById("tasks-container");
if (localStorage.getItem("tasksJSON") != null) {
    tasks = JSON.parse(localStorage.getItem("tasksJSON"));
    for (let task of tasks) {
        container.appendChild(createDiv(task));
    }
}

textarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let date = new Date();
        let formattedDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        let task = {
            task: textarea.value,
            date: formattedDate,
            done: false
        };
        container.insertBefore(createDiv(task), container.childNodes[0]);
        textarea.value = "";
        tasks.unshift(task);
        localStorage.setItem("tasksJSON", JSON.stringify(tasks));
    }
});

function createDiv(task) {
    let div = document.createElement("div");
    let divClass = document.createAttribute("class");
    divClass.value = "task-box";
    div.setAttributeNode(divClass);
    if (task["done"] === true) {
        div.innerHTML = "<p class=\"task-name\">" + task["task"] + "</p>\n" +
            "            <p class=\"task-date\">" + task["date"] + "</p>\n" +
            "            <br>\n" +
            "            <button type=\"button\" class=\"buttons delete-button\" onclick='deleteTask(this)'>DELETE</button>\n" +
            "            <div class=\"done\">\n" +
            "                <img src=\"check.svg\" alt=\"check\">\n" +
            "                <p>DONE</p>\n" +
            "            </div>";
    } else {
        div.innerHTML = "<p class=\"task-name\">" + task["task"] + "</p>\n" +
            "            <p class=\"task-date\">" + task["date"] + "</p>\n" +
            "            <br>\n" +
            "            <button type=\"button\" class=\"buttons delete-button\" onclick='deleteTask(this)'>DELETE</button>\n" +
            "            <button type=\"button\" class=\"buttons mark-done-button\" onclick='markDone(this)'>MARK DONE</button>";

    }
    return div;
}

function showAllTasks() {
    for (let i = 0; i < container.childElementCount; i++) {
        container.children[i].style.display = "flex";
    }
}

function showUndoneTasks() {
    for (let i = 0; i < container.childElementCount; i++) {
        if (tasks[i].done === true) {
            container.children[i].style.display = "none";
        }
    }
}

function deleteTask(button) {
    for (let i = 0; i < container.children.length; i++) {
        if (button.parentNode === container.children[i]) {
            container.removeChild(container.children[i]);
            tasks.splice(i, 1);
            localStorage.setItem("tasksJSON", JSON.stringify(tasks));
            break;
        }
    }
}

function markDone(button) {
    let task;
    for (let i = 0; i < container.children.length; i++) {
        if (button.parentNode === container.children[i]) {
            tasks[i].done = true;
            localStorage.setItem("tasksJSON", JSON.stringify(tasks));
            task = tasks[i];
            break;
        }
    }
    let parentNode = button.parentNode;
    parentNode.innerHTML = "<p class=\"task-name\">" + task["task"] + "</p>\n" +
        "            <p class=\"task-date\">" + task["date"] + "</p>\n" +
        "            <br>\n" +
        "            <button type=\"button\" class=\"buttons delete-button\" onclick='deleteTask(this)'>DELETE</button>\n" +
        "            <div class=\"done\">\n" +
        "                <img src=\"check.svg\" alt=\"check\">\n" +
        "                <p>DONE</p>\n" +
        "            </div>";
    if (document.getElementById("undone-radio").checked === true)
        parentNode.style.display = "none";
}