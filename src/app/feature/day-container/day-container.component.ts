import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventCustomComponent } from '@shared/components/event-custom/event-custom.component';

import { DateHelper } from '@core/util/date-helper';
import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { UrlDateService } from '@core/service/url-date.service';
import { AppointmentService } from '@core/service/appointment.service';
import { AppointmentEventComponent } from '@shared/components/appointment-event/appointment-event.component';

@Component({
  selector: 'app-day-container',
  templateUrl: './day-container.component.html',
  styleUrl: './day-container.component.css',
  standalone: true,
  imports: [EventCustomComponent, AppointmentEventComponent],
})
export class DayContainerComponent implements OnInit, OnDestroy {
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLDivElement>;
  
  dateHelper: DateHelper = new DateHelper(new Date());
  customDate: Date = new Date();
  currentDate = new Date();
  group: GroupAppointmentEvent = { date: new Date(), appointments: [] };
  hours: string[] = [];
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
    private appointmentSrv: AppointmentService,
  ) {
    this.createHours();
  }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.customDate = date;
      this.group = this.appointmentSrv.getOfDay(date);
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  private createHours() {
    for(let i = 1; i <= 24; i++) {
      let hourString = i.toString().padStart(2,'0') + ":00";
      this.hours.push(hourString);
    }
  }

  public isCurrentDay(customDay: Date): boolean {
    return this.dateHelper.isEqualDate(this.currentDate, customDay);
  }

  public scrollToMoment(top: number): void {
    const container = this.contentContainer.nativeElement;
    container.scrollTo({
      top: top - container.offsetHeight / 2,
      behavior: 'smooth',
    });
  }

  public appointmentsAllDay() {
    return this.group.appointments.filter(a => 
      a.allDay && this.dateHelper.isDateInRange(this.customDate,a.timeRangeOfEvent.start, a.timeRangeOfEvent.end)
    )
  }
}
