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
export class EventCustomComponent implements OnChanges {
  @Input({ required: true }) heightPerHours!: number;
  @Input({ required: true }) unitOfMeasure!: string;
  @Input({ required: true }) tasks: Task[] = []

  constructor() { }

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
}
