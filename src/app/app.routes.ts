import { Routes } from '@angular/router';

import { routes as tasksRoutes } from './task-list/task-list.routes';
import { NotFoundComponent } from './not-found/not-found.component';
import { TaskListComponent, resolveTasks } from './task-list/task-list.component';

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
        data: {
            message: 'data:message'
        },
        title: "Tasks",
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
            tasks: resolveTasks
        }
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
