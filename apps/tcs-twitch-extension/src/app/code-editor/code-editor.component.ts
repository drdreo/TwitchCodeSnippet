import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorService } from './monaco-editor.service';
import { TcsService } from '../tcs.service';

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

    private readonly monacoEditorService: MonacoEditorService = inject(MonacoEditorService);
    private readonly tcsService: TcsService = inject(TcsService);

    constructor() {
        effect(() => {
            const finished = this.monacoEditorService.loadingFinished();
            console.log('Monaco editor loading effect: ' + finished);

            if (finished) {
                this.monacoEditorService.createEditor(this.editorContent().nativeElement);
            }
        });
    }

    ngAfterViewInit() {
        this.monacoEditorService.load();
    }

    sendSuggestion() {
        const code = this.monacoEditorService.getContent();
        this.tcsService.sendCodeSuggestion(code);
    }
}
