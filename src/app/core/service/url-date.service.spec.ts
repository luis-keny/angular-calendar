import { TestBed } from '@angular/core/testing';
import { UrlDateService } from './url-date.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

describe('UrlDateService', () => {
  let service: UrlDateService;
  let mockRouter: { events: Subject<any>, url: string };

  beforeEach(() => {
    mockRouter = {
      events: new Subject<any>(),
      url: ''
    };

    TestBed.configureTestingModule({
      providers: [
        UrlDateService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(UrlDateService);
  });

  it('should extract date from URL and emit it', (done) => {
    mockRouter.url = '/path/to/2025/01/15';
    mockRouter.events.next(new NavigationEnd(1, mockRouter.url, mockRouter.url));

    service.getDateFromUrlObservable().subscribe(date => {
      if (date.getFullYear() === 2022 && date.getMonth() === 0 && date.getDate() === 25) {
        expect(date.getFullYear()).toBe(2022);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(25);
        done();
      }
    });

    mockRouter.url = '/path/to/2022/01/25';
    mockRouter.events.next(new NavigationEnd(2, mockRouter.url, mockRouter.url));
  });

  it('should return current date for invalid URL', (done) => {
    mockRouter.url = '/path/to/invalid/url';
    mockRouter.events.next(new NavigationEnd(1, '/path/to/invalid/url', '/path/to/invalid/url'));

    service.getDateFromUrlObservable().subscribe(date => {
      const today = new Date();
      expect(date.getFullYear()).toBe(today.getFullYear());
      expect(date.getMonth()).toBe(today.getMonth());
      expect(date.getDate()).toBe(today.getDate());
      done();
    });
  });
});
