import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CanDeactivateFn, Router, RouterLink } from '@angular/router';

import { TasksService } from '../task-list.service';
import { Priority, Status } from '../task-item/task-item.model';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
    enteredTitle = signal('');
    enteredDescription = signal('');
    enteredStatus = signal<Status>('To Do');
    enteredDate = signal('');
    enteredPriority = signal<Priority>('P1');
    submitted = false;
    private tasksService = inject(TasksService);
    private router = inject(Router);

    onSubmit() {
        this.tasksService.addTask(
            {
                title: this.enteredTitle(),
                description: this.enteredDescription(),
                status: this.enteredStatus(),
                dueDate: this.enteredDate(),
                priority: this.enteredPriority(),
            },
        );
        this.submitted = true;

        this.router.navigate(['/tasks'], {
            replaceUrl: true,
        })
    }
}

export const canLeaveEditPage: CanDeactivateFn<TaskFormComponent> = (component) => {
    if (component.submitted) {
        return true;
    }
    if (
            component.enteredTitle() ||
            component.enteredDescription() ||
            component.enteredStatus() ||
            component.enteredDate() ||
            component.enteredPriority()
        ) {
        return window.confirm('Do you really want to leave? You will lose the entered data.')
    }
    return true;
}
