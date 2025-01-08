import { Component, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { GroupAppointmentEvent } from '@core/data/adapters/group-appointment-event';
import { AppointmentService } from '@core/service/appointment.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class PopoverComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) date!: Date;
  @Input({ required: true }) childElement!: ElementRef;
  @Input({ required: true }) parentElement!: ElementRef;

  group: GroupAppointmentEvent = { date: new Date(), appointments: [] };
  appointmentSub: Subscription = new Subscription();
  
  top: string = '1rem';
  left: string = '5rem';
  width = '180px';

  constructor(
    private appointmentSrv: AppointmentService,
  ) { }

  ngOnChanges(): void {
    this.appointmentSub = this.appointmentSrv.getOfDay(this.date).subscribe(group => this.group = group);
    this.definePosition();
  }

  ngOnDestroy(): void {
    if(this.appointmentSub) this.appointmentSub.unsubscribe();
  }

  public definePosition(){
    this.defineCenterPosition();
  }

  private defineCenterPosition() {
    if(this.childElement === undefined) {
      this.top = "-999px";
      this.left = "-999px";
      return;
    }
    
    const childElem = this.childElement.nativeElement;
    let width = (childElem.clientWidth - parseInt(this.width)) / 2;
    let leftPosition = childElem.offsetLeft + width > 0 ? childElem.offsetLeft + width : 0;
    
    this.top = childElem.offsetTop + "px";
    this.left = leftPosition + "px";
  }
}
