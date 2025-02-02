import { AfterContentInit, AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CalendarView } from '@core/data/adapters/item-calendar';
import { UrlDateService } from '@core/service/url-date.service';
import { DateHelper } from '@core/util/date-helper';
import { ModalService } from '@core/service/modal.service';
import { Appointment } from '@core/data/model/appointment';
import { AppointmentService } from '@core/service/appointment.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) appointments: Appointment[] = [];
  
  currentDay = new Date();
  customDate!: Date;
  calendarView: CalendarView = this.getCalendarViewOfLocalStorage();
  urlDateSub: Subscription = new Subscription();
  dateHelper = new DateHelper(new Date());

  constructor(
    private router: Router,
    private urlDateSrv: UrlDateService,
    private containerRef: ViewContainerRef,
    private modalSrv: ModalService,
    private appointmentSrv: AppointmentService
  ) {}

  ngOnChanges(): void {
    this.modalSrv.initModal(this.containerRef);
    this.appointmentSrv.setAppointments(this.appointments);
    
    const baseUrl = this.router.url.split('/').slice(0, -1).join('/');
    localStorage.setItem('calendar-base-url', baseUrl);
    
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.customDate = date;
      this.dateHelper.updateDate(date);
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  private getCalendarViewOfLocalStorage(): CalendarView {
    const view = localStorage.getItem('calendarView') ?? 'week';
    return view as CalendarView
  }

  private navigateByView(view: CalendarView) {
    const baseUrl = localStorage.getItem('calendar-base-url') ?? '';
    const { day, month, year } = this.dateHelper.getDateParts();
    if(view === 'day') this.router.navigate([`${baseUrl}/day`, year, month, day]);
    if(view === 'week') this.router.navigate([`${baseUrl}/week`, year, month, day]);
    if(view === 'month') this.router.navigate([`${baseUrl}/month`, year, month, day]);
    if(view === 'year') this.router.navigate([`${baseUrl}/year`, year, month, day]);
  }

  public updateViewCalendar(view: CalendarView) {
    this.calendarView = view;
    this.navigateByView(view);
  }

  public redirectCurrentDay() {
    this.dateHelper.updateDate(this.currentDay);
    this.navigateByView(this.calendarView);
  }

  public beforeDate() {
    this.updateDate(-1);
  }

  public nextDate() {
    this.updateDate(1);
  }

  private updateDate(countAdd: number) {
    this.dateHelper.shiftDateByView(countAdd,this.calendarView);
    this.navigateByView(this.calendarView);
  }
}
