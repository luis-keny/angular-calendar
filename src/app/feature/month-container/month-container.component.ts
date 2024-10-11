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
      this.defineMonth(date);
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  private defineMonth(custom: Date) {
    const { month, year } = this.dateHelper.getDateParts(custom);
    
    let lastDayOfMonth: number = this.dateHelper.lastDayOfMonth(custom);
    let weekStartDate = this.dateHelper.buildDate(year,month,1);
    let dayAdjustment: Date = weekStartDate;
    
    this.dateHelper.updateDate(weekStartDate);
    this.calendarDates = [];

    do{
      let rowDays: Date[] = [];
      
      for(let i = 0; i < 7; i++) {
        dayAdjustment = this.dateHelper.adjustDateByDays(i - weekStartDate.getDay());
        rowDays.push(dayAdjustment);
      }
      
      weekStartDate = this.dateHelper.buildDate(year,month,dayAdjustment.getDate()+1);
      this.dateHelper.updateDate(weekStartDate);
      this.calendarDates.push(rowDays);
    } while(!(
      dayAdjustment.getDate() == lastDayOfMonth ||
      dayAdjustment.getMonth() > custom.getMonth() ||
      dayAdjustment.getFullYear() > custom.getFullYear()
    ));

    this.weekDayNames = [];

    this.calendarDates[0].map(day => {
      const name = day.toString().split(" ")[0];
      this.weekDayNames.push(name);
    });
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }
}
