import { Route } from '@angular/router';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'code-editor',
        pathMatch: 'full',
    },
    {
        path: 'code-editor',
        component: CodeEditorComponent,
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
];
