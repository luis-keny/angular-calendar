import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEventComponent } from './appointment-event.component';

describe('AppointmentEventComponent', () => {
  let component: AppointmentEventComponent;
  let fixture: ComponentFixture<AppointmentEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
