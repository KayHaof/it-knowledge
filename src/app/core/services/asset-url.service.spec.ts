import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { AssetUrlService } from './asset-url.service';

describe('AssetUrlService', () => {
  it('resolves local resources against a non-root base href', () => {
    TestBed.configureTestingModule({
      providers: [
        AssetUrlService,
        { provide: DOCUMENT, useValue: { baseURI: 'https://host.test/course/' } },
      ],
    });

    const assets = TestBed.inject(AssetUrlService);
    expect(assets.resolve('generated/lessons.json')).toBe(
      'https://host.test/course/generated/lessons.json',
    );
    expect(assets.resolve('/generated/search-index.json')).toBe(
      'https://host.test/course/generated/search-index.json',
    );
  });

  it('resolves local resources from a root base href', () => {
    TestBed.configureTestingModule({
      providers: [
        AssetUrlService,
        { provide: DOCUMENT, useValue: { baseURI: 'http://localhost:4200/' } },
      ],
    });

    expect(TestBed.inject(AssetUrlService).resolve('generated/roadmaps.json')).toBe(
      'http://localhost:4200/generated/roadmaps.json',
    );
  });

  it('leaves external URLs unchanged', () => {
    TestBed.configureTestingModule({
      providers: [
        AssetUrlService,
        { provide: DOCUMENT, useValue: { baseURI: 'https://host.test/course/' } },
      ],
    });

    expect(TestBed.inject(AssetUrlService).resolve('https://example.com/resource.json')).toBe(
      'https://example.com/resource.json',
    );
  });
});
