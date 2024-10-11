import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';
import { Subscription } from 'rxjs';

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
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getYearByDate(date,6);
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

  public isOtherMonth(month: Date[][], day: Date): boolean {
    return month[1][0].getMonth() != day.getMonth();
  }
}
