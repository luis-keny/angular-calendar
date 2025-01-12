import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { CalendarView } from '@core/data/adapters/item-calendar';
import { ViewCalendarService } from '@core/service/view-calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-custom',
  templateUrl: './select-custom.component.html',
  styleUrl: './select-custom.component.css'
})
export class SelectCustomComponent implements OnInit, OnDestroy {
  @ViewChild('Select') selectElementRef!: ElementRef;
  @Output() viewCalendarChange = new EventEmitter<CalendarView>();
  
  calendarView: CalendarView = this.getCalendarViewOfLocalStorage();
  isDropdownOpen: boolean = false;
  viewCalendarSub = new Subscription();

  constructor(
    private viewCalendarSrv: ViewCalendarService
  ) {}

  ngOnInit() {
    this.viewCalendarChange.emit(this.calendarView);
    this.viewCalendarSub = this.viewCalendarSrv.getViewCalendarObservable()
      .subscribe(view => {
        this.calendarView = view
        this.viewCalendarChange.emit(view);
      });
  }

  ngOnDestroy(): void {
    if(this.viewCalendarSub) this.viewCalendarSub.unsubscribe();
  }

  private getCalendarViewOfLocalStorage(): CalendarView {
    const view = localStorage.getItem('calendarView') ?? 'week';
    return view as CalendarView
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(event: any) {
    if(!this.selectElementRef?.nativeElement.contains(event)) {
      this.isDropdownOpen = false;
    }
  }

  public toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public updateViewCalendar(viewCalendar: CalendarView) {
    this.calendarView = viewCalendar;
    localStorage.setItem('calendarView', viewCalendar);
    this.viewCalendarChange.emit(this.calendarView);
    this.isDropdownOpen = false;
  }
}
