import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children: [
      {
        path: 'day/:year/:month/:day',
        loadComponent: () => import('@feature/day-container/day-container.component').then(m => m.DayContainerComponent)
      },
      {
        path: 'week/:year/:month/:day',
        loadComponent: () => import('@feature/week-container/week-container.component').then(m => m.WeekContainerComponent)
      },
      {
        path: 'month/:year/:month/:day',
        loadComponent: () => import('@feature/month-container/month-container.component').then(m => m.MonthContainerComponent)
      },
      {
        path: 'year/:year/:month/:day',
        loadComponent: () => import('@feature/year-container/year-container.component').then(m => m.YearContainerComponent)
      },
      {
        path: '',
        redirectTo: 'week',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'week',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
