import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    monacoEditorService: MonacoEditorService = inject(MonacoEditorService);

    ngAfterViewInit() {
        this.monacoEditorService.load();
        this.monacoEditorService.loadingFinished.pipe(filter(Boolean), take(1)).subscribe(() => {
            this.monacoEditorService.createEditor(this.editorContent().nativeElement);
        });
    }
}
