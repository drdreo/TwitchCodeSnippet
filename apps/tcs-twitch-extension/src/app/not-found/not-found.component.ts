import { Component } from '@angular/core';

@Component({
    selector: 'not-found',
    template: `
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    `,
    standalone: true,
})
export class NotFoundComponent {}
