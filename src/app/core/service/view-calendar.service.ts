import { Injectable } from '@angular/core';
import { CalendarView } from '@core/data/adapters/item-calendar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewCalendarService {
    private viewCalendar = new BehaviorSubject<CalendarView>('week');

    constructor() {
        this.viewCalendar.subscribe(view => localStorage.setItem('calendarView', view));
    }

    public getViewCalendarObservable() {
        return this.viewCalendar.asObservable();
    }

    public updateViewCalendar(view: CalendarView) {
        this.viewCalendar.next(view);
    }
}