import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssetUrlService {
  private readonly document = inject(DOCUMENT);

  resolve(path: string): string {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
    return new URL(path.replace(/^\/+/, ''), this.document.baseURI).toString();
  }
}
