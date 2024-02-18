import { Route } from '@angular/router';
import { CodeEditorComponent } from './code-editor/code-editor.component';

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
];
