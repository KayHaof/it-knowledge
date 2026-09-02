import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { CatalogFilterOption } from '../../catalog.models';

@Component({
  selector: 'app-catalog-filter-tabs',
  templateUrl: './catalog-filter-tabs.html',
  styleUrl: './catalog-filter-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogFilterTabs {
  readonly label = input.required<string>();
  readonly options = input.required<readonly CatalogFilterOption[]>();
  readonly selected = input.required<string>();
  readonly selectedChange = output<string>();
  private readonly tabScroller = viewChild<ElementRef<HTMLElement>>('tabScroller');

  constructor() {
    afterRenderEffect(() => {
      this.options();
      const selected = this.selected();
      const scroller = this.tabScroller()?.nativeElement;
      const selectedButton = [...(scroller?.querySelectorAll<HTMLButtonElement>('button') ?? [])]
        .find((button) => button.dataset['value'] === selected);
      if (!scroller || !selectedButton) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const selectedRect = selectedButton.getBoundingClientRect();
      const selectedLeft = selectedRect.left - scrollerRect.left + scroller.scrollLeft;
      const selectedRight = selectedLeft + selectedRect.width;
      const visibleRight = scroller.scrollLeft + scroller.clientWidth;
      if (selectedLeft >= scroller.scrollLeft && selectedRight <= visibleRight) return;

      scroller.scrollTo({
        left: Math.max(0, selectedLeft - (scroller.clientWidth - selectedRect.width) / 2),
        behavior: 'auto',
      });
    });
  }

  protected select(value: string): void {
    if (value !== this.selected()) this.selectedChange.emit(value);
  }

  protected handleKeydown(event: KeyboardEvent, index: number): void {
    const options = this.options();
    if (!options.length) return;

    let targetIndex = index;
    if (event.key === 'ArrowRight') {
      targetIndex = (index + 1) % options.length;
    } else if (event.key === 'ArrowLeft') {
      targetIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      targetIndex = 0;
    } else if (event.key === 'End') {
      targetIndex = options.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const tablist = (event.currentTarget as HTMLElement | null)?.parentElement;
    const buttons = tablist?.querySelectorAll<HTMLButtonElement>('button');
    buttons?.item(targetIndex).focus();
  }
}
