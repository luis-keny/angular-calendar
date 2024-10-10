import { Pipe, PipeTransform } from '@angular/core';
import { DateHelper } from '../index-util';

@Pipe({
  name: 'monthYear'
})
export class MonthYearPipe implements PipeTransform {

  transform(value: Date): string {
    const dataHelper: DateHelper = new DateHelper(value);
    const year = value.getFullYear();
    const month = dataHelper.getMonthName();
    
    return `${month} ${year}`;
  }

}
