import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskService, UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';
import { Task } from '../../core/index-model';

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
  tasks: Task[] = []
  currentDate = new Date();
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
    private taskSrv: TaskService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getMonthForDate(date);
      this.weekDayNames = this.dateHelper.getWeekDayNames(this.calendarDates[0]);
      this.taskSrv.getTaskOfMonth(date).subscribe(tasks => {
        this.tasks = tasks;
      });
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

  public filterTasks(date: Date): Task[] {
    return this.tasks.filter(task => this.isEqualDate(task.date,date));
  }

  private isEqualDate(day1: Date, day2: Date): boolean {
    const isEqualYear = day1.getFullYear() == day2.getFullYear();
    const isEqualMonth = day1.getMonth() == day2.getMonth();
    const isEqualDay = day1.getDate() == day2.getDate();

    return isEqualDay && isEqualMonth && isEqualYear;
  }
}
