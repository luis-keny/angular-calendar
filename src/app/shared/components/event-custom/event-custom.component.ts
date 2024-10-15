import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../core/index-model';
import { CalendarTaskDirective } from '../../../core/index-directive';

@Component({
  selector: 'app-event-custom',
  templateUrl: './event-custom.component.html',
  styleUrl: './event-custom.component.css',
  standalone: true,
  imports: [FormsModule, CalendarTaskDirective],
})
export class EventCustomComponent implements OnInit {
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

  public getTopOfCurrentMoment(): string {
    let hour = this.currentMoment.getHours();
    let minute = this.currentMoment.getMinutes();

    const oneHour = this.heightPerHours;
    const top = (oneHour*hour + oneHour*(minute/60));

    return `calc(${top + this.unitOfMeasure} - 0.4rem)`;
  }

  public isEqualDate(day1: Date, day2: Date): boolean {
    const isEqualYear = day1.getFullYear() == day2.getFullYear();
    const isEqualMonth = day1.getMonth() == day2.getMonth();
    const isEqualDay = day1.getDate() == day2.getDate();

    return isEqualDay && isEqualMonth && isEqualYear;
  }
}
