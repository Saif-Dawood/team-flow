import { ApplicationConfig } from '@angular/core';
import {
    provideRouter,
    withComponentInputBinding,
    withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withFetch(),
        ),
        provideRouter(
            routes,
            withComponentInputBinding(),
            withRouterConfig({
                paramsInheritanceStrategy: 'always',
            }),
        ),
    ],
};
