import {Component, OnInit} from '@angular/core';
import {Task, TodosService} from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  onlyUndone = false;

  constructor(public todosService: TodosService) {
  }
  ngOnInit(): void {

  }
}
