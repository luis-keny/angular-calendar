import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { Task } from '../index-model';

@Directive({
  selector: '[appCalendarTask]',
  standalone: true,
})
export class CalendarTaskDirective implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Input({ required: true }) heightPerHours!: number;
  @Input({ required: true }) unitOfMeasure!: string;
  @Input({ required: true }) currentMoment!: Date;
  @Input({ required: true }) taskDay!: Date;

  constructor(
    private elementRef: ElementRef,
    private render: Renderer2,
  ) { }

  ngOnChanges(): void {
    const { startTime, endTime, color } = this.task;

    const { height, top } = this.getTopAndHeight(startTime,endTime);
    const element = this.elementRef.nativeElement;
    const acceptableHeight = (this.heightPerHours*4)/5;
    const backgroundColor = color ?? 'var(--color-900)';

    this.render.setStyle(element, 'height', `calc( ${height} - 1px)`);
    this.render.setStyle(element, 'top', top);
    this.render.setStyle(element, 'background-color', backgroundColor);

    if(this.isLessThatCurrent(this.taskDay, endTime)) {
      this.render.setStyle(element, 'opacity', '0.5');
    } else {
      this.render.setStyle(element, 'opacity', '1');
    }

    if(parseFloat(height) >= acceptableHeight) {
      this.render.setStyle(element,"flex-direction", "column");
    } else {
      this.render.addClass(element,"task--line");
    }

    if(parseFloat(height) <= ((acceptableHeight)/2)) {
      this.render.setStyle(element, "padding", "0 0.5rem")
      this.render.setStyle(element, "font-size", "0.6rem")
    }
  }

  private getTopAndHeight(startTime: string, endTime: string) {
    const startTimeParts = startTime.split(':');
    const endTimeParts = endTime.split(':');
    
    let startHour = parseInt(startTimeParts[0])
    let startMinute = parseInt(startTimeParts[1])
    
    let endHour = parseInt(endTimeParts[0])
    let endMinute = parseInt(endTimeParts[1])

    const oneHour = this.heightPerHours;
    const startTop = (oneHour*startHour + oneHour*(startMinute/60));
    const endTop = (oneHour*endHour + oneHour*(endMinute/60));
    
    const acceptableHeight = endTop - startTop <= (oneHour/3) ? oneHour/3 : endTop - startTop;

    const top = startTop.toString() + this.unitOfMeasure;
    const height = (acceptableHeight).toString() + this.unitOfMeasure;

    return { top, height };
  }

  public isLessThatCurrent(date: Date, endTime: string) {
    const isLessYear = date.getFullYear() < this.currentMoment.getFullYear();
    const isLessMonth = date.getMonth() < this.currentMoment.getMonth();
    const isLessDay = date.getDate() < this.currentMoment.getDate();
    const isEqualDay = date.getDate() == this.currentMoment.getDate();

    const endTimeParts = endTime.split(':');
    
    let endHour = parseInt(endTimeParts[0]);
    let endMinute = parseInt(endTimeParts[1]);

    const isEqualHour = endHour == this.currentMoment.getHours();
    const isLessHour = endHour < this.currentMoment.getHours();
    const isLessMinute = endMinute < this.currentMoment.getMinutes();

    return isLessYear || isLessMonth || isLessDay || (isEqualDay && (isLessHour || (isEqualHour && isLessMinute)));
  }
}
