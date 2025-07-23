import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, CanDeactivateFn, Router, RouterLink } from '@angular/router';

import { TasksService } from '../task-list.service';
import { NewTaskData, Priority, Status, Task } from '../task-item/task-item.model';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
    submitted = false;
    private tasksService = inject(TasksService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private id = -1;

    taskForm!: FormGroup;
    submitText: string = 'Create';

    ngOnInit() {
        const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

        if (id){
            const task = this.tasksService.filterById(id);
            if (task) {
                this.taskForm = new FormGroup({
                    title: new FormControl(task.title),
                    description: new FormControl(task.description),
                    status: new FormControl<Status>(task.status),
                    priority: new FormControl<Priority>(task.priority),
                    dueDate: new FormControl(task.dueDate),
                });
                this.id = id;
                this.submitText = 'Edit';
                return;
            }
        }
        this.taskForm = new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            status: new FormControl<Status>('To Do'),
            priority: new FormControl<Priority>('P1'),
            dueDate: new FormControl(''),
        });
    }
  
    onSubmit() {
        if (this.taskForm.valid) {
            const task = this.taskForm.value as NewTaskData;
            if (this.id !== -1) {
                this.tasksService.removeTask(this.id);
                this.tasksService.addTask(task, this.id);
            }
            else {
                this.tasksService.addTask(task);
            }
            this.submitted = true;

            this.router.navigate(['/tasks'], {
                replaceUrl: true,
            })
        }
    }
  
}

export const canLeaveEditPage: CanDeactivateFn<TaskFormComponent> = (component) => {

    const task = component.taskForm.value as NewTaskData;
    if (component.submitted) {
        return true;
    }
    if (task.title ||
        task.description ||
        task.dueDate
    ) {
        return window.confirm('Do you really want to leave? You will lose the entered data.')
    }
    return true;
}
