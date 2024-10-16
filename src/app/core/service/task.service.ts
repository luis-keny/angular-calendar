import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task, TaskGroup, TaskJson } from '../index-model';
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

    getAll(): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => this.transformToTaskGroup(tasks))
        )
    }

    getTaskOfDay(date: Date): Observable<TaskGroup> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const dateTasks = tasks.filter(task => this.dateToStringFormat(date) === task.date);
                if(dateTasks.length<=0) return { date: date, tasks: [] };
                return this.transformToTaskGroup(dateTasks)[0];
            })
        )
    }

    getTaskOfWeek(date: Date): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const week = this.dateHelper.getWeekForDate(date);
                const weekString = week.map(day => this.dateToStringFormat(day));
                const dateTasks = tasks.filter(task => weekString.includes(task.date));
                
                return this.transformToTaskGroup(dateTasks);
            })
        )
    }

    getTaskOfMonth(date: Date): Observable<TaskGroup[]> {
        return this.http.get<TaskJson[]>(this.url).pipe(
            map(tasks => {
                const month = this.dateHelper.getMonthForDate(date);
                const monthString = month.map(week => week.map(day => this.dateToStringFormat(day)));
                const dateTasks = tasks.filter(task => monthString.some(week => week.includes(task.date)));
                
                return this.transformToTaskGroup(dateTasks);
            })
        )
    }

    private dateToStringFormat(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2,'0');
        const day = (date.getDate()).toString().padStart(2,'0');
        return `${year}-${month}-${day}`;
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
                group.tasks.push(this.transformToTask(taskJson));
                taskGroups.push(group);
            } else {
                taskGroups.some(taskGroup => {
                    if(!(this.dateHelper.isEqualDate(dateGroup, taskGroup.date))) return false;
                    taskGroup.tasks.push(this.transformToTask(taskJson));
                    return true;
                })
            }
        }

        return taskGroups;
    }

    private transformToTask(taskJson: TaskJson): Task {
        return {
            title: taskJson.title,
            startTime: taskJson.startTime,
            endTime: taskJson.endTime,
            color: taskJson.color,
        }
    }
}