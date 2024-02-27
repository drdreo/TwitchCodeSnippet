import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type * as monacoType from 'monaco-editor';

declare const require: any;
declare const monaco: any;

@Injectable({
    providedIn: 'root',
})
export class MonacoEditorService {
    private editorInstance?: monacoType.editor.IStandaloneCodeEditor;
    public loadingFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {}

    createEditor(host: HTMLElement) {
        this.editorInstance = monaco.editor.create(host, {
            value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            language: 'typescript',

            theme: 'vs-dark',
            fontFamily: 'JetBrains Mono',
            automaticLayout: true,
            cursorBlinking: 'smooth',

            unusualLineTerminators: 'auto',
        });
    }

    load() {
        if (typeof monaco !== 'undefined') {
            this.finishLoading();
            return;
        }

        // require is provided by loader.min.js.
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this.finishLoading();
        });
    }

    private finishLoading() {
        this.loadingFinished.next(true);
    }
}
