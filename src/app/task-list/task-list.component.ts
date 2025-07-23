import { Component, OnInit, inject, input } from '@angular/core';
import { TasksService } from './task-list.service';
import { Task } from './task-item/task-item.model';
import { ResolveFn, RouterLink, RouterOutlet } from '@angular/router';
import { TaskItemComponent } from "./task-item/task-item.component";

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [RouterLink, TaskItemComponent, RouterOutlet],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
})
export class TaskListComponent {
    tasks = input.required<Task[]>();
    order = input<'asc' | 'desc' | undefined>();
}

export const resolveTasks: ResolveFn<Task[]> = (
    activatedRouteSnapshot,
    routerState
) => {
    const order = activatedRouteSnapshot.queryParams['order'];
    const tasksService = inject(TasksService);
    tasksService.fetchTasks();
    const tasks = tasksService.allTasks();

    if (order && order === 'asc') {
        tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
    } else {
        tasks.sort((a, b) => (a.id > b.id ? -1 : 1));
    }

    return tasks.length ? tasks : [];
};
