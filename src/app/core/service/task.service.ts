import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TaskMapper } from '@core/data/mappers/task-mapper';
import { DateHelper } from '@core/util/date-helper';
import { TaskGroup } from '@core/data/adapters/task';
import { TaskJson } from '@core/data/model/task-json';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private url: string = 'json/task.json';
    private dateHelper: DateHelper = new DateHelper();
    private taskMapper: TaskMapper = new TaskMapper();
    
    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => this.transformToTaskGroup(tasks))
        )
    }

    public getTaskOfDay(date: Date): Observable<TaskGroup> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const dateTasks = tasks.filter(task => this.dateHelper.dateToStringFormat(date) === task.date);
                if(dateTasks.length<=0) return { date: date, tasks: [] };
                return this.transformToTaskGroup(dateTasks)[0];
            })
        )
    }

    public getTaskOfWeek(date: Date): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const week = this.dateHelper.getWeekForDate(date);
                const weekString = week.map(day => this.dateHelper.dateToStringFormat(day));
                const dateTasks = tasks.filter(task => weekString.includes(task.date));
                
                return this.transformToTaskGroup(dateTasks);
            })
        )
    }

    public getTaskOfMonth(date: Date): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const month = this.dateHelper.getMonthForDate(date);
                const monthString = month.map(week => week.map(day => this.dateHelper.dateToStringFormat(day)));
                const dateTasks = tasks.filter(task => monthString.some(week => week.includes(task.date)));
                
                return this.transformToTaskGroup(dateTasks);
            })
        )
    }

    private transformToTaskGroup(tasksJson: TaskJson[]): TaskGroup[] {
        let taskGroups: TaskGroup[] = [];

        for(let taskJson of tasksJson) {
            const dateStringParts = taskJson.date.split('-');
            const year = parseInt(dateStringParts[0]);
            const month = parseInt(dateStringParts[1]);
            const day = parseInt(dateStringParts[2]);
            const dateGroup = this.dateHelper.buildDate(year, month, day);

            let group = taskGroups.filter(taskGroup => this.dateHelper.isEqualDate(dateGroup, taskGroup.date))[0];

            if(!group) {
                group = { date: dateGroup, tasks: [] }
                group.tasks.push(this.taskMapper.goFrom(taskJson));
                taskGroups.push(group);
            } else {
                taskGroups.some(taskGroup => {
                    if(!(this.dateHelper.isEqualDate(dateGroup, taskGroup.date))) return false;
                    taskGroup.tasks.push(this.taskMapper.goFrom(taskJson));
                    return true;
                })
            }
        }

        return taskGroups;
    }
}