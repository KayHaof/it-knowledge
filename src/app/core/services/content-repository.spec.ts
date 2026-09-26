import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AssetUrlService } from './asset-url.service';
import { ContentRepository } from './content-repository';

describe('ContentRepository asset URLs', () => {
  it('requests every generated resource under the configured base href', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AssetUrlService,
        ContentRepository,
        { provide: DOCUMENT, useValue: { baseURI: 'http://localhost:4200/course/' } },
      ],
    });

    const repository = TestBed.inject(ContentRepository);
    const http = TestBed.inject(HttpTestingController);
    const requests = [
      { promise: repository.lessons(), url: 'http://localhost:4200/course/generated/lessons.json' },
      { promise: repository.interviewQuestions(), url: 'http://localhost:4200/course/generated/interview.json' },
      { promise: repository.roadmaps(), url: 'http://localhost:4200/course/generated/roadmaps.json' },
      { promise: repository.searchIndex(), url: 'http://localhost:4200/course/generated/search-index.json' },
      { promise: repository.flashcards(), url: 'http://localhost:4200/course/generated/flashcards.json' },
      { promise: repository.manifest(), url: 'http://localhost:4200/course/generated/manifest.json' },
      { promise: repository.stats(), url: 'http://localhost:4200/course/generated/content-stats.json' },
    ];

    for (const request of requests) {
      const response = request.url.endsWith('manifest.json') || request.url.endsWith('content-stats.json') ? {} : [];
      http.expectOne(request.url).flush(response);
    }
    await Promise.all(requests.map((request) => request.promise));
    http.verify();
  });

  it('shows a public-safe message when generated data cannot load', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AssetUrlService,
        ContentRepository,
        { provide: DOCUMENT, useValue: { baseURI: 'https://host.test/it-knowledge/' } },
      ],
    });
    const repository = TestBed.inject(ContentRepository);
    const request = repository.lessons();
    TestBed.inject(HttpTestingController)
      .expectOne('https://host.test/it-knowledge/generated/lessons.json')
      .flush('missing', { status: 404, statusText: 'Not Found' });

    await expect(request).rejects.toBeDefined();
    expect(repository.loadError()).toBe('Không thể tải dữ liệu học tập. Vui lòng thử tải lại trang.');
    expect(repository.loadError()).not.toContain('npm run');
  });
});
