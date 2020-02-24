import { Injectable } from '@angular/core';

export class Task {
  id: string;
  text: string;
  done: boolean;
  creationDate: number;
  constructor(id, text, done, creationDate) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.creationDate = creationDate;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  TASK_ID_PREFIX = 'task-';
  storage = localStorage;
  tasks: Task[] = [];
  constructor() {
    this.getTasks();
  }
  getTasks() {
    this.tasks.length = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.indexOf(this.TASK_ID_PREFIX) > -1) {
        this.tasks.push(JSON.parse(this.storage.getItem(key)));
      }
    }
    this.tasks.sort(function compare(taskA, taskB) {
      if (taskA.creationDate > taskB.creationDate) {
        return -1;
      }
      if (taskB.creationDate > taskA.creationDate) {
        return 1;
      }
      return 0;
    });
  }
  addTask(taskText) {
    const date = new Date();
    const taskId = this.TASK_ID_PREFIX + date.getTime();
    const task = new Task(taskId, taskText, false, date.getTime());
    this.storage.setItem(taskId, JSON.stringify(task));
    this.getTasks();
  }
  updateTask(taskId, task) {
    this.storage.setItem(taskId, JSON.stringify(task));
    this.getTasks();
  }
  deleteTask(taskId) {
    this.storage.removeItem(taskId);
    this.getTasks();
  }
}
