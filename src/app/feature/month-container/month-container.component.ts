import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

import { PopoverComponent } from '@shared/components/popover/popover.component';

import { TaskService, UrlDateService } from '@core/index-service';
import { DateHelper } from '@core/index-util';
import { Task, TaskGroup } from '@core/index-model';

@Component({
  selector: 'app-month-container',
  templateUrl: './month-container.component.html',
  styleUrl: './month-container.component.css',
  standalone: true,
  imports: [PopoverComponent],
})
export class MonthContainerComponent implements OnInit, OnDestroy {
  @ViewChildren('DayElement') dayElements!: QueryList<ElementRef>;
  @ViewChild('MonthContainer') monthContainer!: ElementRef;
  selectedElement: ElementRef | undefined;

  weekDayNames: string[] = [];
  calendarDates: Date[][] = [];
  taskGroups: TaskGroup[] = []
  currentDate = new Date();
  selectedDate: Date = new Date();
  
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

  @HostListener('click', ['$event'])
  resetPoper($event: any) {
    if($event.target.className != 'event--more') {
      this.selectedElement = undefined;
    }
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

  public popoverActive(date: Date) {
    const dayElement = this.dayElements.filter(element => 
      element.nativeElement.children[0].textContent == date.toString()
    )[0];
    this.selectedElement = dayElement;
    this.selectedDate = date;
  }
}
