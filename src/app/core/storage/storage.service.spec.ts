import { StorageService } from './storage.service';

describe('StorageService', () => {
  const service = new StorageService();
  beforeEach(() => localStorage.clear());

  it('round-trips structured values', () => {
    service.write('test', { count: 2 });
    expect(service.read('test', { count: 0 })).toEqual({ count: 2 });
  });

  it('uses the fallback for malformed JSON', () => {
    localStorage.setItem('test', '{broken');
    expect(service.read('test', ['safe'])).toEqual(['safe']);
  });
});
