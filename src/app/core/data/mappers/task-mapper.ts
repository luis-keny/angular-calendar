import { DateHelper } from "@core/util/date-helper";
import { TaskJson } from "../model/task-json";
import { Task } from "../adapters/task";

export class TaskMapper {
    private dateHelper: DateHelper = new DateHelper();
    
    public goFrom(model: TaskJson): Task {
        return {
            title: model.title,
            startTime: model.startTime,
            endTime: model.endTime,
            color: model.color,
        }
    }
    
    public goTo(adapter: Task, date: Date): TaskJson {
        const dateString = this.dateHelper.dateToStringFormat(date);
        return {
            title: adapter.title,
            startTime: adapter.startTime,
            date: dateString,
            endTime: adapter.endTime,
            color: adapter.color,
        }
    }
}