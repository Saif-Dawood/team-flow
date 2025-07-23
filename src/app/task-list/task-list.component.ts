import { Component, OnInit, inject, input } from '@angular/core';
import { TasksService } from './task-list.service';
import { Task } from './task-item/task-item.model';
import { ResolveFn, RouterLink, RouterOutlet } from '@angular/router';
import { TaskItemComponent } from "./task-item/task-item.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, TaskItemComponent, RouterOutlet],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
    tasksService = inject(TasksService);
    order = input<'asc' | 'desc' | undefined>();
    taskForm!: FormGroup;

    ngOnInit(): void {
        this.tasksService.fetchTasks();
        this.taskForm = new FormGroup({
            statusFilter: new FormControl<string>('no filter'),
        });
    }

    onSubmit() {
        if (this.taskForm.valid) {
            const status = this.taskForm.value['statusFilter'];
            this.tasksService.filterByStatus(status);
        }
    }
}

export const resolveTasks: ResolveFn<Task[]> = (
    activatedRouteSnapshot,
    routerState
) => {
    console.log("resolveTasks() is currently running")
    const order = activatedRouteSnapshot.queryParams['order'];
    const tasksService = inject(TasksService);
    const tasks = tasksService.allTasks()

    if (order && order === 'asc') {
        tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
    } else {
        tasks.sort((a, b) => (a.id > b.id ? -1 : 1));
    }

    return tasks.length ? tasks : [];
};
