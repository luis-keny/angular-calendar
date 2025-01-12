import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UrlDateService } from '@core/service/url-date.service';
import { DateHelper } from '@core/util/date-helper';
import { ViewCalendarService } from '@core/service/view-calendar.service';


@Component({
  selector: 'app-year-container',
  templateUrl: './year-container.component.html',
  styleUrl: './year-container.component.css',
  standalone: true,
  imports: [],
})
export class YearContainerComponent implements OnInit, OnDestroy {
  @ViewChild('ContentMain') contentMainElementRef!: any;

  weekDayNames: string[] = [];
  calendarDates: Date[][][] = [];
  currentDate = new Date();
  dateSelected = new Date();

  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
    private router: Router,
    private viewCalendarSrv: ViewCalendarService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getYearByDate(date,6);
      this.dateSelected = date;
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  public getNameOfMonth(month: Date[][]): string {
    return this.dateHelper.getMonthName(month[1][0].getMonth())
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }

  public isDateSelected(custom: Date) {
    const selected = this.dateHelper.getDateParts(this.dateSelected);
    const date = this.dateHelper.getDateParts(custom);

    return selected.year == date.year && selected.month == date.month && selected.day == date.day;
  }

  public isOtherMonth(month: Date[][], day: Date): boolean {
    return month[1][0].getMonth() != day.getMonth();
  }

  public navigateByDay(date: Date) {
    const baseUrl = localStorage.getItem('calendar-base-url') ?? '';
    const { day, month, year } = this.dateHelper.getDateParts(date);
    this.router.navigate([`${baseUrl}/year`, year, month, day]);
  }

  public navigateByView(date: Date) {
    const baseUrl = localStorage.getItem('calendar-base-url') ?? '';
    const { day, month, year } = this.dateHelper.getDateParts(date);
    this.viewCalendarSrv.updateViewCalendar('day');
    this.router.navigate([`${baseUrl}/day`, year, month, day]);
  }
}
