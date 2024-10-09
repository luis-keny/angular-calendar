import { Component } from '@angular/core';
import { CalendarView } from '../../core/index-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  currentDate: Date = new Date();

  constructor(
    private router: Router
  ) {}

  public updateViewCalendar(event: CalendarView) {
    if(event === 'day') this.router.navigate(['calendar/day']);
    if(event === 'week') this.router.navigate(['calendar/week']);
    if(event === 'month') this.router.navigate(['calendar/month']);
    if(event === 'year') this.router.navigate(['calendar/year']);
  }
}
