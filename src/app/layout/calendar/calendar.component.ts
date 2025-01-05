import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CalendarView } from '@core/data/adapters/calendarView';
import { UrlDateService } from '@core/service/url-date.service';
import { DateHelper } from '@core/util/date-helper';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentDay = new Date();
  customDate!: Date;
  calendarView: CalendarView = this.getCalendarViewOfLocalStorage();
  urlDateSub: Subscription = new Subscription();
  dateHelper = new DateHelper(new Date());

  constructor(
    private router: Router,
    private urlDateSrv: UrlDateService,
  ) {}

  ngOnInit(): void {
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
    const { day, month, year } = this.dateHelper.getDateParts();
    if(view === 'day') this.router.navigate(['calendar/day', year, month, day]);
    if(view === 'week') this.router.navigate(['calendar/week', year, month, day]);
    if(view === 'month') this.router.navigate(['calendar/month', year, month, day]);
    if(view === 'year') this.router.navigate(['calendar/year', year, month, day]);
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
