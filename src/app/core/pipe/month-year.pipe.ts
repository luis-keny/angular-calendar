import { Pipe, PipeTransform } from '@angular/core';

import { CalendarView } from '@core/data/adapters/calendarView';
import { DateHelper } from '@core/util/date-helper';

@Pipe({
  name: 'monthYear'
})
export class MonthYearPipe implements PipeTransform {

  transform(value: Date, calendarView: CalendarView): string {
    
    if(calendarView == 'day') return this.getForDay(value);
    if(calendarView == 'week') return this.getForWeek(value);
    if(calendarView == 'month') return this.getForMonth(value);
    if(calendarView == 'year') return this.getForYear(value);
    
    return `Not found`;
    
  }

  private getForDay(date: Date): string {
    const dataHelper: DateHelper = new DateHelper(date);
    const year = date.getFullYear();
    const monthName = dataHelper.getMonthName();
    
    return `${monthName} ${year}`;
  }

  private getForWeek(date: Date): string {
    const dataHelper: DateHelper = new DateHelper(date);
    const week: Date[] = dataHelper.getWeekForDate();
    const startDate = week[0];
    const endDate = week[week.length -1];
    
    if(startDate.getMonth() != endDate.getMonth()) {
      let firstNameMonth: string = dataHelper.getMonthName(startDate.getMonth()).slice(0,3);
      let secondNameMonth: string = dataHelper.getMonthName(endDate.getMonth()).slice(0,3);

      if(startDate.getFullYear() != endDate.getFullYear()) firstNameMonth += ' ' + startDate.getFullYear();
      secondNameMonth += ' ' + endDate.getFullYear();

      return `${firstNameMonth} - ${secondNameMonth}`;
    }
    
    const year = date.getFullYear();
    const monthName = dataHelper.getMonthName();

    return `${monthName} ${year}`;
  }

  private getForMonth(date: Date): string {
    const dataHelper: DateHelper = new DateHelper(date);
    const year = date.getFullYear();
    const monthName = dataHelper.getMonthName();
    
    return `${monthName} ${year}`;
  }

  private getForYear(date: Date): string {
    return date.getFullYear().toString();
  }

}