import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { DiagramBlock } from '../../../core/models/content.models';

@Component({ selector: 'app-diagram', templateUrl: './diagram.html', styleUrl: './diagram.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class Diagram implements OnInit, OnDestroy {
  readonly block = input.required<DiagramBlock>();
  protected readonly failed = signal(false);
  protected readonly imageUrl = signal('');
  async ngOnInit(): Promise<void> {
    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'neutral' });
      const id = `diagram-${crypto.randomUUID()}`;
      const { svg } = await mermaid.render(id, this.block().code);
      this.imageUrl.set(URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })));
    } catch { this.failed.set(true); }
  }
  ngOnDestroy(): void { if (this.imageUrl()) URL.revokeObjectURL(this.imageUrl()); }
}
