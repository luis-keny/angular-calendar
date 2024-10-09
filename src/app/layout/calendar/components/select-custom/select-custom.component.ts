import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

import { CalendarView } from '../../../../core/index-model';

@Component({
  selector: 'app-select-custom',
  templateUrl: './select-custom.component.html',
  styleUrl: './select-custom.component.css'
})
export class SelectCustomComponent {
  @ViewChild('Select') selectElementRef!: ElementRef;
  @Output() viewCalendarChange = new EventEmitter<CalendarView>();
  
  calendarView: CalendarView = 'week';
  isDropdownOpen: boolean = false;

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
    this.viewCalendarChange.emit(this.calendarView);
    this.isDropdownOpen = false;
  }
}
