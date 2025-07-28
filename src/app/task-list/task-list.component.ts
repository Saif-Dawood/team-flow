import { Component, OnInit, inject, input } from '@angular/core';
import { TasksService } from './task-list.service';
import { RouterOutlet } from '@angular/router';
import { TaskItemComponent } from "./task-item/task-item.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [ ReactiveFormsModule, TaskItemComponent, RouterOutlet],
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
