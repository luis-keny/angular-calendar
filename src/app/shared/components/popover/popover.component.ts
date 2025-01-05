import { Component, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { TaskGroup } from '@core/data/adapters/task';
import { TaskService } from '@core/service/task.service';

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

  group: TaskGroup = { date: new Date(), tasks: [] };
  taskSub: Subscription = new Subscription();
  
  top: string = '1rem';
  left: string = '5rem';
  width = '180px';

  constructor(
    private taskSrv: TaskService,
  ) { }

  ngOnChanges(): void {
    this.taskSub = this.taskSrv.getTaskOfDay(this.date).subscribe(group => this.group = group);
    this.definePosition();
  }

  ngOnDestroy(): void {
    if(this.taskSub) this.taskSub.unsubscribe();
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
