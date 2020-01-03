// Solution based on the Model-View-Controller (MVC) pattern

// The model (cares about the data)

class Task {

    constructor(id, text, done, creationDate) {
        this.id = id;
        this.text = text;
        this.done = done;
        this.creationDate = creationDate;
    }
}

// This service wraps now the localStorage as backend. Later the localStorage can be easily replaced by (AJAX) calls to real service
class TaskService {

    TASK_ID_PREFIX = "task-";
    storage = localStorage;

    // Returns the list of tasks sorted in descending date
    getTasks() {

        let tasks = [];
        for (let i = 0; i < this.storage.length; i++) {

            let key = this.storage.key(i);
            if (key.indexOf(this.TASK_ID_PREFIX) > -1) {
                tasks.push(JSON.parse(this.storage.getItem(key)));
            }
        }

        return tasks.sort(function compare(taskA, taskB) {
            if (taskA.creationDate > taskB.creationDate) return -1;
            if (taskB.creationDate > taskA.creationDate) return 1;

            return 0;
        });
    }

    addTask(taskText) {

        // the service takes care of creating the ID and adding a timestamp for creation
        // initially a task is not DONE by default
        let date = new Date();
        let taskId = this.TASK_ID_PREFIX + date.getTime(); // use date as unique and incrementing id
        let task = new Task(taskId, taskText, false, date.getTime());
        this.storage.setItem(taskId, JSON.stringify(task));
    }

    updateTask(taskId, task) {
        this.storage.setItem(taskId, JSON.stringify(task));
    }

    deleteTask(taskId) {
        this.storage.removeItem(taskId);
    }

}

// The view (cares about rendering the data and attaching event handlers)

class TaskView {

    constructor(onMarkDoneClick, onDeleteClick) {
        this.onMarkDoneClick = onMarkDoneClick;
        this.onDeleteClick = onDeleteClick;
    }

    render(task) {

        let $element = $(".task-box-template").clone().contents();

        // the syntax $(selector, context) allows us to scope our selection to selector within context
        $(".task-name", $element).text(task.text);
        $(".task-date", $element).text(this.formatDate(task.creationDate));

        if (task.done) {

            $(".done", $element).removeClass("invisible");

        } else {

            $(".mark-done-button", $element).on("click", function (e) {
                this.onMarkDoneClick(task);
            }.bind(this));

            $(".mark-done-button", $element).removeClass("invisible");
        }

        $(".delete-button", $element).on("click", function (e) {

            this.onDeleteClick(task);

        }.bind(this));

        return $element;
    }

    formatDate(dateAsLong) {
        let date = new Date(dateAsLong);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}

class TaskListView {

    constructor(onMarkDoneClick, onDeleteClick) {
        this.onMarkDoneClick = onMarkDoneClick;
        this.onDeleteClick = onDeleteClick;
        this.$element = $("#tasks-container");
    }

    render(tasks) {
        this.$element.html("");//remove existing children

        for (let i = 0; i < tasks.length; i++) {
            this.$element.append(new TaskView(this.onMarkDoneClick, this.onDeleteClick).render(tasks[i]));
        }

    }
}


// Controller (coordinates model and view). It:
// a) handles the events triggered by the view, and
// b) handles the data coming from the model an apply it to the view

class TaskController {
    ALL_FILTER = 0;
    UNDONE_FILTER = 1;
    filter = this.ALL_FILTER;

    constructor() {
        this.taskListView = new TaskListView(this.markTaskAsDone.bind(this), this.deleteTask.bind(this));
        this.taskService = new TaskService();
    }

    loadTasks() {
        let tasks = this.taskService.getTasks();

        if (this.filter === this.UNDONE_FILTER) {
            tasks = tasks.filter(function (task) {
                return !task.done;
            });
        }

        this.taskListView.render(tasks);
    }

    setAllFilter() {
        this.filter = this.ALL_FILTER;
        this.loadTasks();
    }

    setUndoneFilter() {
        this.filter = this.UNDONE_FILTER;
        this.loadTasks();
    }

    markTaskAsDone(task) {
        task.done = true;
        this.taskService.updateTask(task.id, task);
        this.loadTasks();
    }

    deleteTask(task) {
        this.taskService.deleteTask(task.id);
        this.loadTasks();
    }

    addTask(taskText) {
        this.taskService.addTask(taskText);
        this.loadTasks();
    }

}


$(document).ready(function () {

    // The DOM is ready and we can access the DOM elements here

    let controller = new TaskController();

    $("#add-task").on("keypress", function (e) {

        // "this" here is textarea
        let $textarea = $(this);

        if (e.key === "Enter" && $textarea.val()) { // prevent adding empty notes
            e.preventDefault();
            controller.addTask($textarea.val());
            // clear text area after addition
            $textarea.val("");
        }
    });

    $("#all-radio").click(function (e) {
        controller.setAllFilter();
    });

    $("#undone-radio").click(function (e) {
        controller.setUndoneFilter();
    });

    controller.loadTasks();
});
