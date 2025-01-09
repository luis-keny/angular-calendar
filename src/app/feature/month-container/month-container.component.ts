import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

import { PopoverComponent } from '@shared/components/popover/popover.component';

import { AppointmentEvent, GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { DateHelper } from '@core/util/date-helper';
import { UrlDateService } from '@core/service/url-date.service';
import { AppointmentService } from '@core/service/appointment.service';


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
  group: GroupAppointmentEvent[] = []
  currentDate = new Date();
  selectedDate: Date = new Date();
  
  dateHelper: DateHelper = new DateHelper();
  urlDateSub: Subscription = new Subscription();

  constructor(
    private urlDateSrv: UrlDateService,
    private appointmentSrv: AppointmentService,
  ) { }

  ngOnInit(): void {
    this.urlDateSub = this.urlDateSrv.getDateFromUrlObservable().subscribe(date => {
      this.calendarDates = this.dateHelper.getMonthForDate(date);
      this.weekDayNames = this.dateHelper.getWeekDayNames(this.calendarDates[0]);
      this.group = this.appointmentSrv.getOfMonth(date);
    });
  }

  ngOnDestroy(): void {
    if(this.urlDateSub) this.urlDateSub.unsubscribe();
  }

  @HostListener('click', ['$event'])
  resetPopover($event: any) {
    if($event.target.className != 'event--more') {
      this.selectedElement = undefined;
    }
  }

  public isCurrentDay(selectedDate: Date): boolean {
    const current = this.dateHelper.getDateParts(this.currentDate);
    const date = this.dateHelper.getDateParts(selectedDate);

    return current.year == date.year && current.month == date.month && current.day == date.day;
  }

  public filterForDate(date: Date): AppointmentEvent[] {
    const appointment = this.group.filter(a => this.dateHelper.isEqualDate(date, a.date));
    if(appointment.length <= 0) return [];
    return appointment[0].appointments;
  }

  public popoverActive(date: Date) {
    const dayElement = this.dayElements.filter(element => 
      element.nativeElement.children[0].textContent == date.toString()
    )[0];
    this.selectedElement = dayElement;
    this.selectedDate = date;
  }
}
