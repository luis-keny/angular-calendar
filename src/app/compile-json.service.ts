import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '@core/data/model/appointment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompileJsonService {
  private url: string = 'json/appointment.json';
  
  constructor(
    private http: HttpClient,
  ) { }

  public getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.url).pipe(
      map(data => data.map(data => {
        return {...data, start: new Date(data.start), end: new Date(data.end)}
      }))
    )
  }
}
