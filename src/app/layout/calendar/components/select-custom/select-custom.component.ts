import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

import { CalendarView } from '@core/index-model';

@Component({
  selector: 'app-select-custom',
  templateUrl: './select-custom.component.html',
  styleUrl: './select-custom.component.css'
})
export class SelectCustomComponent implements OnInit {
  @ViewChild('Select') selectElementRef!: ElementRef;
  @Output() viewCalendarChange = new EventEmitter<CalendarView>();
  
  calendarView: CalendarView = this.getCalendarViewOfLocalStorage();
  isDropdownOpen: boolean = false;

  ngOnInit() {
    this.viewCalendarChange.emit(this.calendarView);
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
