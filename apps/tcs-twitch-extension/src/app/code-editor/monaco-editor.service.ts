import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MonacoEditorService {
    loaded = false;

    public loadingFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {}

    private finishLoading() {
        this.loaded = true;
        this.loadingFinished.next(true);
    }

    public load() {
        // load the assets

        const baseUrl = './assets' + '/monaco-editor/min/vs';

        if (typeof (<any>window).monaco === 'object') {
            this.finishLoading();
            return;
        }

        const onGotAmdLoader: any = () => {
            // load Monaco
            (<any>window).require.config({ paths: { vs: `${baseUrl}` } });
            (<any>window).require([`vs/editor/editor.main`], () => {
                this.finishLoading();
            });
        };

        // load AMD loader, if necessary
        if (!(<any>window).require) {
            const loaderScript: HTMLScriptElement = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = `${baseUrl}/loader.js`;
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        } else {
            onGotAmdLoader();
        }
    }
}
