import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompileJsonService } from './compile-json.service';
import { Subscription } from 'rxjs';
import { Appointment } from '@core/data/model/appointment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'calendar';
  compileJsonSub = new Subscription();
  appointments: Appointment[] = [];

  constructor(
    private compileJsonSrv: CompileJsonService,
  ){ }

  ngOnInit(): void {
    this.compileJsonSub = this.compileJsonSrv.getAll().subscribe({
      next: (data) => this.appointments = data,
      error: (err) => console.log(err)
    })
  }

  ngOnDestroy(): void {
    if(this.compileJsonSub) this.compileJsonSub.unsubscribe();
  }
}
