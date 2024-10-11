import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UrlDateService } from '../../core/index-service';
import { DateHelper } from '../../core/index-util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-month-container',
  templateUrl: './month-container.component.html',
  styleUrl: './month-container.component.css',
  standalone: true,
  imports: [],
})
export class MonthContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ContentMain') contentMainElementRef!: any;

  weekDayNames: string[] = [];
  calendarDates: Date[][] = [];
  currentDate = new Date();
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private render: Renderer2,
    private urlDateSrv: UrlDateService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.defineMonth(date);
    });
  }

  ngAfterViewInit(): void {
    this.calculateHeightContentEvent();
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

  private calculateHeightContentEvent() {
    if(!this.contentMainElementRef) return;
    const heightHeaderCalendar = 59;
    const contentMainElement= this.contentMainElementRef.nativeElement;

    this.render.setStyle(contentMainElement,'height',`calc(100vh - (${ heightHeaderCalendar }px))`)
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }
}
