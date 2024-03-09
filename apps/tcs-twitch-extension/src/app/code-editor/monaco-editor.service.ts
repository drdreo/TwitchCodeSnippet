import { Injectable, signal } from '@angular/core';
import type * as monacoType from 'monaco-editor';

declare const require: any;
declare const monaco: any;

@Injectable({
    providedIn: 'root',
})
export class MonacoEditorService {
    loadingFinished = signal(false);
    private editorInstance?: monacoType.editor.IStandaloneCodeEditor;

    constructor() {}

    createEditor(host: HTMLElement) {
        this.editorInstance = monaco.editor.create(host, {
            value: ['function x() {', '\tconsole.log("Backseat here we go!");', '}'].join('\n'),
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

    getContent(): string {
        if (!this.editorInstance) {
            throw new Error('Trying to get editor content, but editor is not initialized yet');
        }
        return this.editorInstance.getValue();
    }

    private finishLoading() {
        this.loadingFinished.set(true);
    }
}
