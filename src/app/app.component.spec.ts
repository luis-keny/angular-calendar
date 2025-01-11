import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { CalendarModule } from '@layout/calendar/calendar.module';

describe('AppComponent', () => {
  let app: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CalendarModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        provideHttpClient()
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'calendar'`, () => {
    expect(app.title).toEqual('calendar');
  });
});
