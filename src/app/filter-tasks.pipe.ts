import { Pipe, PipeTransform } from '@angular/core';
import {Task} from './todos.service';

@Pipe({
  name: 'filterTasks',
  pure: false
})
export class FilterTasksPipe implements PipeTransform {

  transform(tasks: Task[], onlyUndone: boolean): Task[] {
    if (onlyUndone === false || tasks.length === 0) {
      return tasks;
    }
    return tasks.filter( task => {
      if (task.done === false) {
        return task;
      }
    });
  }

}
