import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { YearContainerComponent } from '../year-container/year-container.component';
import { EventCustomComponent } from '../../shared/components/event-custom/event-custom.component';

import { ModalConfig, Task } from '../../core/index-model';
import { ModalService, TaskService, UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';

@Component({
  selector: 'app-week-container',
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
  standalone: true,
  imports: [EventCustomComponent],
})
export class WeekContainerComponent implements OnInit, OnDestroy {
  dateHelper: DateHelper = new DateHelper();
  customDates: Date[] = [];
  currentDate = new Date();
  tasks: Task[] = [];
  hours: string[] = [];
  urlDateSub: Subscription = new Subscription();

  constructor(
    private modalSrv: ModalService,
    private viewContainerRef: ViewContainerRef,
    private urlDateSrv: UrlDateService,
    private taskSrv: TaskService,
  ) {
    this.createHours();
  }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.customDates = this.dateHelper.getWeekForDate(date);
      this.taskSrv.getTaskOfWeek(date).subscribe(tasks => {
        this.tasks = tasks;
      });
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

  public modalOpen() {
    const configureModal: ModalConfig = {
      component: YearContainerComponent,
      title: 'Add event'
    }
    this.modalSrv.openModal(this.viewContainerRef, configureModal);
  }

  public isCurrentDay(customDay: Date): boolean {
    let current = this.dateHelper.getDateParts(this.currentDate)
    let custom = this.dateHelper.getDateParts(customDay)

    return current.year == custom.year && current.month == custom.month && current.day == custom.day;
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
