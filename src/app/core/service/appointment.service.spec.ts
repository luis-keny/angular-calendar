import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';
import { provideHttpClient } from '@angular/common/http';

describe('AppointmentService', () => {
  let service: AppointmentService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(AppointmentService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });
});