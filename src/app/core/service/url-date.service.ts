import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlDateService {

  private dateFromUrl = new BehaviorSubject<Date>(new Date());

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const date: Date = this.extractDateFromUrl();
        this.dateFromUrl.next(date);
      });
  }

  private extractDateFromUrl(): Date {
    const urlParts = this.router.url.split('/').slice(-3);
    const year = parseInt(urlParts[0]);
    const month = parseInt(urlParts[1]);
    const day = parseInt(urlParts[2]);

    if (year && month && day) {
      return new Date(year, month - 1, day);
    }

    return new Date();
  }

  public getDateFromUrlObservable() {
    return this.dateFromUrl.asObservable();
  }
}
