import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';

@Component({
  selector: 'app-month-container',
  templateUrl: './month-container.component.html',
  styleUrl: './month-container.component.css',
  standalone: true,
  imports: [],
})
export class MonthContainerComponent implements OnInit, OnDestroy {
  weekDayNames: string[] = [];
  calendarDates: Date[][] = [];
  currentDate = new Date();
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getMonthForDate(date);
      this.weekDayNames = this.dateHelper.getWeekDayNames(this.calendarDates[0]);
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }
}
