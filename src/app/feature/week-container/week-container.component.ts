import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventCustomComponent } from '@shared/components/event-custom/event-custom.component';

import { DateHelper } from '@core/util/date-helper';
import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { UrlDateService } from '@core/service/url-date.service';
import { AppointmentService } from '@core/service/appointment.service';


@Component({
  selector: 'app-week-container',
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
  standalone: true,
  imports: [EventCustomComponent],
})
export class WeekContainerComponent implements OnInit, OnDestroy {
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLDivElement>;

  dateHelper: DateHelper = new DateHelper();
  customDates: Date[] = [];
  currentDate = new Date();
  group: GroupAppointmentEvent[] = [];
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
      this.customDates = this.dateHelper.getWeekForDate(date);
      this.group = this.appointmentSrv.getOfWeek(date);
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
}
