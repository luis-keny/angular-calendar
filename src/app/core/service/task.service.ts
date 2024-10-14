import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task, TaskJson } from '../index-model';
import { map, Observable } from 'rxjs';
import { DateHelper } from '../index-util';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    url: string = 'json/task.json';
    dateHelper: DateHelper = new DateHelper();
    
    constructor(
        private http: HttpClient
    ) { }

    getAll(): Observable<Task[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => tasks.map(this.transformToEntity))
        )
    }

    getTaskOfDay(date: Date): Observable<Task[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const dateTasks = tasks.filter(task => this.dateToStringFormat(date) === task.date);
                
                return dateTasks.map(task => this.transformToEntity(task));
            })
        )
    }

    getTaskOfWeek(date: Date): Observable<Task[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const week = this.dateHelper.getWeekForDate(date);
                const weekString = week.map(day => this.dateToStringFormat(day));
                const dateTasks = tasks.filter(task => weekString.includes(task.date));
                
                return dateTasks.map(task => this.transformToEntity(task));
            })
        )
    }

    getTaskOfMonth(date: Date): Observable<Task[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const month = this.dateHelper.getMonthForDate(date);
                const monthString = month.map(week => week.map(day => this.dateToStringFormat(day)));
                const dateTasks = tasks.filter(task => monthString.some(week => week.includes(task.date)));
                
                return dateTasks.map(task => this.transformToEntity(task));
            })
        )
    }

    private dateToStringFormat(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2,'0');
        const day = (date.getDate()).toString().padStart(2,'0');
        return `${year}-${month}-${day}`;
    }

    private transformToEntity(taskJson: TaskJson): Task {
        const dateParts = taskJson.date.split("-");
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        return {
            title: taskJson.title,
            date: this.dateHelper.buildDate(year, month, day),
            startTime: taskJson.startTime,
            endTime: taskJson.endTime,
            color: taskJson.color,
        }
    }
}