import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '@core/service/modal.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class EventFormComponent {
  form = new FormGroup({    
    title: new FormControl('',[Validators.required]),
    startTime: new FormControl('',[Validators.required]),
    endTime: new FormControl('',[Validators.required]),
    color: new FormControl(''),
  });

  constructor(
    private modalService: ModalService,
  ) { }

  public onSubmit() {
    const appointmentEvent = this.form.value;
    localStorage.setItem('appointment-event', JSON.stringify(appointmentEvent));
    this.modalService.closeModal();
  }
}
