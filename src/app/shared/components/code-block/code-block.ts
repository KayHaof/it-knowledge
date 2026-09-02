import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import { CodeBlock as CodeBlockModel } from '../../../core/models/content.models';

hljs.registerLanguage('java', java); hljs.registerLanguage('javascript', javascript); hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sql', sql); hljs.registerLanguage('bash', bash); hljs.registerLanguage('json', json); hljs.registerLanguage('yaml', yaml);

@Component({ selector: 'app-code-block', templateUrl: './code-block.html', styleUrl: './code-block.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class CodeBlock implements AfterViewInit {
  readonly block = input.required<CodeBlockModel>();
  protected readonly copied = signal(false);
  private readonly codeElement = viewChild.required<ElementRef<HTMLElement>>('code');
  ngAfterViewInit(): void { hljs.highlightElement(this.codeElement().nativeElement); }
  async copy(): Promise<void> { await navigator.clipboard.writeText(this.block().code); this.copied.set(true); setTimeout(() => this.copied.set(false), 1400); }
}
