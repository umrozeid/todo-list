import {Component} from '@angular/core';
import {TodosService} from '../todos.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.css']
})
export class TodoInputComponent {
  constructor(private todosService: TodosService) { }

  addTask(event: Event) {
    const textArea = event.target as HTMLInputElement;
    event.preventDefault();
    if ( textArea.value ) {
      this.todosService.addTask(textArea.value);
      textArea.value = '';
    }
  }
}
