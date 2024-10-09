import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYear'
})
export class MonthYearPipe implements PipeTransform {

  transform(value: Date): string {
    const items = value.toString().split(' ').slice(0, 4);
    const year = items[3];
    const month = this.completeMonth(items[1]);
    return `${month} ${year}`;
  }

  private completeMonth(month: string): string {
    switch (month) {
      case 'Jan':
        return 'January';
      case 'Feb':
        return 'February';
      case 'Mar':
        return 'March';
      case 'Apr':
        return 'April';
      case 'May':
        return 'May';
      case 'Jun':
        return 'June';
      case 'Jul':
        return 'July';
      case 'Aug':
        return 'August';
      case 'Sep':
        return 'September';
      case 'Oct':
        return 'October';
      case 'Nov':
        return 'November';
      case 'Dec':
        return 'December';
      default:
        return month;
    }
  }

}
