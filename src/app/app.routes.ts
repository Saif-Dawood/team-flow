import { Routes } from '@angular/router';

import { routes as tasksRoutes } from './task-list/task-list.routes';
import { NotFoundComponent } from './not-found/not-found.component';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
    {
        path: '', // <your-domain>/
        redirectTo: 'tasks',
        pathMatch: 'full',
        title: 'No task selected',
    },
    {
        path: 'tasks',
        component: TaskListComponent,
        children: tasksRoutes,
        title: "Tasks",
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
