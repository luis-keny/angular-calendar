import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '@core/data/model/appointment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompileJsonService {
  private url: string = 'json/appointment.json';
  
  constructor(
    private http: HttpClient,
  ) { }

  public getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.url)
  }
}
