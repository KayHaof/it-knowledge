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
    ];

    for (const request of requests) http.expectOne(request.url).flush([]);
    await Promise.all(requests.map((request) => request.promise));
    http.verify();
  });
});
