import { Component, inject, input } from '@angular/core';
import { Task } from './task-item.model';
import { TasksService } from '../task-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from "../../shared/card/card.component";
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-task-item',
    standalone: true,
    imports: [CardComponent, DatePipe, TitleCasePipe],
    templateUrl: './task-item.component.html',
    styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
    task = input.required<Task>();
    private tasksService = inject(TasksService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    onComplete() {
        this.tasksService.removeTask(this.task().id);
        this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            onSameUrlNavigation: 'reload',
            queryParamsHandling: 'preserve',
        });
    }

    onEdit() {
        this.router.navigate(['./edit/', this.task().id], {
            relativeTo: this.activatedRoute,
            onSameUrlNavigation: 'reload',
            queryParamsHandling: 'preserve',
        });
    }

    getPriorityString(priority: string) {
        switch (priority) {
            case 'P1':
                return {
                    value: 'Critical',
                    color: 'Red',
                };
            case 'P2':
                return {
                    value: 'Major',
                    color: 'Orange',
                };
            case 'P3':
                return {
                    value: 'Medium',
                    color: 'Blue',
                };
            case 'P4':
                return {
                    value: 'Low',
                    color: 'Green',
                };
            default:
                return {
                    value: 'Something wrong happened',
                    color: 'Black',
                };
        }
    }
}

