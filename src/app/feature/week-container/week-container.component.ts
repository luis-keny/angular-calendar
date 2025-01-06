import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { YearContainerComponent } from '../year-container/year-container.component';
import { EventCustomComponent } from '@shared/components/event-custom/event-custom.component';

import { DateHelper } from '@core/util/date-helper';
import { TaskGroup } from '@core/data/adapters/task';
import { ModalService } from '@core/service/modal.service';
import { UrlDateService } from '@core/service/url-date.service';
import { TaskService } from '@core/service/task.service';
import { ModalConfig } from '@core/data/system/modal';


@Component({
  selector: 'app-week-container',
  templateUrl: './week-container.component.html',
  styleUrl: './week-container.component.css',
  standalone: true,
  imports: [EventCustomComponent],
})
export class WeekContainerComponent implements OnInit, OnDestroy {
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLDivElement>;

  dateHelper: DateHelper = new DateHelper();
  customDates: Date[] = [];
  currentDate = new Date();
  taskGroups: TaskGroup[] = [];
  hours: string[] = [];
  urlDateSub: Subscription = new Subscription();
  taskSub: Subscription = new Subscription();

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
      this.taskSub = this.taskSrv.getTaskOfWeek(date).subscribe(tasks => {
        this.taskGroups = tasks;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
    if(this.taskSub) this.taskSub.unsubscribe();
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
    return this.dateHelper.isEqualDate(this.currentDate, customDay);
  }

  public scrollToMoment(top: number): void {
    const container = this.contentContainer.nativeElement;
    container.scrollTo({
      top: top - container.offsetHeight / 2,
      behavior: 'smooth',
    });
  }
}
