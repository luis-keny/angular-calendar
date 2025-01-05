export interface Task {
    title: string;
    startTime: string;
    endTime: string;
    color?: string;
    top?: string;
    height?: string;
}

export interface TaskGroup {
    date: Date;
    tasks: Task[];
}
