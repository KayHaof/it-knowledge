import { TestBed } from '@angular/core/testing';
import { SearchDocument } from '../models/content.models';
import { ContentRepository } from './content-repository';
import { SearchService } from './search.service';

const documents: SearchDocument[] = [
  { id:'n1',slug:'n-plus-one',title:'JPA N+1 Query',description:'Nhận diện truy vấn lặp',category:'database',technology:'Hibernate',level:'advanced',tags:['fetch'],headings:['Giải pháp'],content:'EntityGraph và DTO projection',path:'/learn/database/n-plus-one' },
  { id:'redis',slug:'redis',title:'Redis',description:'Bộ nhớ đệm',category:'nosql',technology:'Redis',level:'intermediate',tags:['cache'],headings:['TTL'],content:'cache stampede',path:'/learn/nosql/redis' },
  { id:'generic-lag',slug:'generic-lag',title:'Consumer patterns',description:'Consumer throughput',category:'messaging',technology:'Messaging',level:'intermediate',tags:['consumer'],headings:['Operations'],content:'Retry messages',path:'/learn/messaging/generic-lag' },
  { id:'kafka-lag',slug:'kafka-lag',title:'Kafka operations',description:'Consumer lag troubleshooting',category:'messaging',technology:'Kafka',level:'advanced',tags:['consumer','lag'],headings:['Lag'],content:'Measure consumer lag per partition',path:'/learn/messaging/kafka-lag' },
];

describe('SearchService', () => {
  it('ranks title matches and normalizes Vietnamese accents', async () => {
    TestBed.configureTestingModule({ providers: [SearchService, { provide: ContentRepository, useValue: { searchIndex: () => Promise.resolve(documents) } }] });
    const service = TestBed.inject(SearchService);
    const titleMatch = await service.search('N+1');
    const accentMatch = await service.search('bo nho dem');
    expect(titleMatch[0].id).toBe('n1');
    expect(accentMatch[0].id).toBe('redis');
  });

  it('returns no result for an empty query', async () => {
    TestBed.configureTestingModule({ providers: [SearchService, { provide: ContentRepository, useValue: { searchIndex: () => Promise.resolve(documents) } }] });
    expect(await TestBed.inject(SearchService).search(' ')).toEqual([]);
  });

  it('prioritizes an exact multi-term phrase over partial term matches', async () => {
    TestBed.configureTestingModule({ providers: [SearchService, { provide: ContentRepository, useValue: { searchIndex: () => Promise.resolve(documents) } }] });
    const results = await TestBed.inject(SearchService).search('consumer lag');
    expect(results[0].id).toBe('kafka-lag');
    expect(results.findIndex((result) => result.id === 'generic-lag')).toBeGreaterThan(0);
  });
});
