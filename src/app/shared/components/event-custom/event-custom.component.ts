import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../core/index-model';

@Component({
  selector: 'app-event-custom',
  templateUrl: './event-custom.component.html',
  styleUrl: './event-custom.component.css',
  standalone: true,
  imports: [FormsModule]
})
export class EventCustomComponent implements OnInit, OnChanges {
  @Input({ required: true }) heightPerHours!: number;
  @Input({ required: true }) unitOfMeasure!: string;
  @Input({ required: true }) tasks: Task[] = []
  @Input({ required: true }) dateSelected!: Date;
  currentMoment: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.currentMoment = new Date();
    }, 60 * 1000);
  }

  ngOnChanges(): void {
    this.tasks.map(task => {
      const { top, height } = this.getTopAndHeight(task.startTime, task.endTime);
    
      task.top = top
      task.height = height;
    })
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
    
    const top = startTop.toString() + this.unitOfMeasure;
    const height = (endTop - startTop).toString() + this.unitOfMeasure;

    return { top, height };
  }

  public getTopOfCurrentMoment(): string {
    let hour = this.currentMoment.getHours();
    let minute = this.currentMoment.getMinutes();

    const oneHour = this.heightPerHours;
    const top = (oneHour*hour + oneHour*(minute/60));

    return top + this.unitOfMeasure;
  }

  public isEqualDate(day1: Date, day2: Date): boolean {
    const isEqualYear = day1.getFullYear() == day2.getFullYear();
    const isEqualMonth = day1.getMonth() == day2.getMonth();
    const isEqualDay = day1.getDate() == day2.getDate();

    return isEqualDay && isEqualMonth && isEqualYear;
  }

  public isLessThatCurrent(task: Task) {
    const isLessYear = task.date.getFullYear() < this.currentMoment.getFullYear();
    const isLessMonth = task.date.getMonth() < this.currentMoment.getMonth();
    const isLessDay = task.date.getDate() < this.currentMoment.getDate();
    const isEqualDay = task.date.getDate() == this.currentMoment.getDate();

    const startTimeParts = task.startTime.split(':');
    
    let startHour = parseInt(startTimeParts[0])
    let startMinute = parseInt(startTimeParts[1])

    const isLessHour = startHour < this.currentMoment.getHours();
    const isLessMinute = startMinute < this.currentMoment.getMinutes();

    return isLessYear || isLessMonth || (isLessDay || (isLessHour && isLessMinute && isEqualDay));
  }
}
