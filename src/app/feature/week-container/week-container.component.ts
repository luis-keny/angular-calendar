import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventCustomComponent } from '@shared/components/event-custom/event-custom.component';

import { DateHelper } from '@core/util/date-helper';
import { AppointmentEvent, GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { UrlDateService } from '@core/service/url-date.service';
import { AppointmentService } from '@core/service/appointment.service';
import { Router } from '@angular/router';
import { ViewCalendarService } from '@core/service/view-calendar.service';
import { AppointmentEventComponent } from '@shared/components/appointment-event/appointment-event.component';


@Component({
  selector: 'app-week-container',
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
  standalone: true,
  imports: [EventCustomComponent, AppointmentEventComponent],
})
export class WeekContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('contentAllDay') contentAllDay!: ElementRef<HTMLDivElement>;

  dateHelper: DateHelper = new DateHelper();
  week: Date[] = [];
  objectWeek: {day: Date, zIndex: number}[] = [];
  zIndexes: number[] = [7,6,5,4,3,2,1];
  currentDate = new Date();
  group: GroupAppointmentEvent[] = [];
  hours: string[] = [];
  urlDateSub: Subscription = new Subscription();
  widthContentAllDay: string = '200px';

  constructor(
    private urlDateSrv: UrlDateService,
    private appointmentSrv: AppointmentService,
    private router: Router,
    private viewCalendarSrv: ViewCalendarService,
  ) {
    this.createHours();
  }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      const week = this.dateHelper.getWeekForDate(date);
      this.week = week;
      this.objectWeek = []
      for(let i = 0; i < week.length; i++) {
        const day = week[i];
        this.objectWeek.push({day, zIndex: this.getZIndex(i)});
      }
      this.group = this.appointmentSrv.getOfWeek(date);
    });
  }

  ngAfterViewInit(): void {
    this.defineWidthOfContentAllDay();
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  private defineWidthOfContentAllDay() {
    this.widthContentAllDay = this.contentAllDay.nativeElement.offsetWidth.toString() + 'px';
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

  public navigateByView(date: Date) {
    const baseUrl = localStorage.getItem('calendar-base-url') ?? '';
    const { day, month, year } = this.dateHelper.getDateParts(date);
    this.viewCalendarSrv.updateViewCalendar('day');
    this.router.navigate([`${baseUrl}/day`, year, month, day]);
  }

  public appointmentsAllDay(date: Date, index: number) {
    const appointments = this.group[index].appointments.filter(a => 
      a.allDay && this.dateHelper.isDateInRange(date,a.timeRangeOfEvent.start, a.timeRangeOfEvent.end)
    )
    console.log(appointments);
    return appointments
  }

  public defineAmountOfDaysInRange(dateChecked: Date, appointment: AppointmentEvent): string {
    const lastDayWeek = this.week[this.week.length - 1];
    const lastDayRange = appointment.timeRangeOfEvent.end;
    const lastDay = lastDayRange < lastDayWeek ? lastDayRange : lastDayWeek;
    const countsDays = this.dateHelper.getDaysInRange(dateChecked, lastDay).length;
    return `calc(${this.widthContentAllDay} * ${countsDays})`;
  }

  public getZIndex(index: number): number {
    const zIndex = 7 - index;
    return zIndex;
  }
}
