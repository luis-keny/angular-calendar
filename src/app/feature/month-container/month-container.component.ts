import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskService, UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';
import { Task, TaskGroup } from '../../core/index-model';

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
  taskGroups: TaskGroup[] = []
  currentDate = new Date();
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();
  taskSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
    private taskSrv: TaskService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getMonthForDate(date);
      this.weekDayNames = this.dateHelper.getWeekDayNames(this.calendarDates[0]);
      this.taskSub = this.taskSrv.getTaskOfMonth(date).subscribe(tasks => {
        this.taskGroups = tasks;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
    if(this.taskSub) this.taskSub.unsubscribe();
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }

  public filterForDate(date: Date): Task[] {
    const tasks = this.taskGroups.filter(group => this.dateHelper.isEqualDate(date, group.date));
    if(tasks.length <= 0) return [];
    return tasks[0].tasks;
  }
}
