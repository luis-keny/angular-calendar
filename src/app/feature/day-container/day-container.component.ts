import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';

import { YearContainerComponent } from '../year-container/year-container.component';
import { ModalService, UrlDateService } from '../../core/index-service';
import { ModalConfig } from '../../core/index-model';
import { Subscription } from 'rxjs';
import { DateHelper } from '../../core/index-util';

@Component({
  selector: 'app-day-container',
  templateUrl: './day-container.component.html',
  styleUrl: './day-container.component.css',
  standalone: true,
  imports: [],
})
export class DayContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ContentDay') contentDayElementRef!: any;
  @ViewChild('ContentEvent') contentEventElementRef!: any;
  dateHelper: DateHelper = new DateHelper(new Date());
  customDate: Date = new Date();
  currentDate = new Date();
  hours: string[] = [];
  urlDateSub: Subscription = new Subscription();

  constructor(
    private modalSrv: ModalService,
    private viewContainerRef: ViewContainerRef,
    private render: Renderer2,
    private urlDateSrv: UrlDateService,
  ) {
    this.createHours();
  }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.customDate = date;
    });
  }

  ngAfterViewInit(): void {
    this.calculateHeightContentEvent();
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

  private calculateHeightContentEvent() {
    if(!this.contentDayElementRef && !this.contentEventElementRef) return;
    const heightHeaderCalendar = 59;
    const heightContentDay = this.contentDayElementRef.nativeElement.offsetHeight;
    const contentEventElement= this.contentEventElementRef.nativeElement;
    this.render.setStyle(contentEventElement,'height',`calc(100vh - (${ heightContentDay + heightHeaderCalendar }px))`)
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
}
