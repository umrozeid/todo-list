import {Component, Input} from '@angular/core';
import {Task, TodosService} from '../todos.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  @Input() task: Task;
  constructor(private todosService: TodosService) { }
  deleteTask() {
    this.todosService.deleteTask(this.task.id);
  }
  markAsDone() {
    this.task.done = true;
    this.todosService.updateTask(this.task.id, this.task);
  }
}
