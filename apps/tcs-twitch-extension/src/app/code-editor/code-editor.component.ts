import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as monaco from 'monaco-editor';
import { MonacoEditorService } from './monaco-editor.service';
import { filter, take } from 'rxjs';

@Component({
    selector: 'twitch-code-suggestion-code-editor',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './code-editor.component.html',
    styleUrl: './code-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditorComponent implements AfterViewInit {
    editorContent = viewChild.required('editor', { read: ElementRef });
    editorInstance?: monaco.editor.IStandaloneCodeEditor;

    monacoEditorService: MonacoEditorService = inject(MonacoEditorService);

    ngAfterViewInit() {
        this.monacoEditorService.load();
        this.monacoEditorService.loadingFinished.pipe(filter(Boolean), take(1)).subscribe(() => {
            this.initMonaco();
        });
    }

    private initMonaco() {
        this.createEditor();
    }

    private createEditor() {
        this.editorInstance = monaco.editor.create(this.editorContent().nativeElement, {
            value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            language: 'typescript',

            theme: 'vs-dark',
            fontFamily: 'JetBrains Mono',
            automaticLayout: true,
            cursorBlinking: 'smooth',

            unusualLineTerminators: 'auto',
        });
    }
}
