import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentBlock } from '../../../core/models/content.models';
import { CodeBlock } from '../code-block/code-block';
import { Diagram } from '../diagram/diagram';
import { InlineText } from '../inline-text/inline-text';

@Component({ selector: 'app-lesson-renderer', imports: [CodeBlock, Diagram, InlineText], templateUrl: './lesson-renderer.html', styleUrl: './lesson-renderer.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LessonRenderer { readonly blocks = input.required<ContentBlock[]>(); }
