import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
        this.taskForm = new FormGroup({
            title: new FormControl('', [
                Validators.required,
                Validators.minLength(3)
            ]),
            description: new FormControl('', [
                Validators.required,
                Validators.minLength(10)
            ]),
            status: new FormControl<Status>('To Do', [
                Validators.required
            ]),
            priority: new FormControl<Priority>('P4', [
                Validators.required
            ]),
            dueDate: new FormControl('', [
                Validators.required,
                (control) => {
                    const selectedDate = new Date(control.value);
                    const now = new Date();
                    return selectedDate > now ? null : { dateInvalid: true };
                }
            ]),
        });
        const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

        if (id){
            const task = this.tasksService.filterById(id);
            if (task) {
                this.taskForm.setValue({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                });
                this.id = id;
                this.submitText = 'Edit';
            }
        }
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
        else {
            console.log(this.taskForm);
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
