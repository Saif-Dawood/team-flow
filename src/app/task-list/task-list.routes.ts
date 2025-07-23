import { Routes } from '@angular/router';

import { TaskFormComponent, canLeaveEditPage } from './task-form/task-form.component';

export const routes: Routes = [
    {
        path: 'add',
        component: TaskFormComponent,
        canDeactivate: [canLeaveEditPage],
    },
    // {
    //     path: 'edit/:id',
    //     component: TaskFormComponent,
    //     canDeactivate: [canLeaveEditPage],
    // },
    // {
    //     path: ':id',
    //     component: TaskDetailsComponent,
    // },
];