import { CalendarView, DateParts } from "../index-model";

export class DateHelper {
    private date: Date = new Date();

    private months: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    private monthDaysMap = [
        { month: 1, maxDay: 31 },
        { month: 2, maxDay: 28 },
        { month: 3, maxDay: 31 },
        { month: 4, maxDay: 30 },
        { month: 5, maxDay: 31 },
        { month: 6, maxDay: 30 },
        { month: 7, maxDay: 31 },
        { month: 8, maxDay: 31 },
        { month: 9, maxDay: 30 },
        { month: 10, maxDay: 31 },
        { month: 11, maxDay: 30 },
        { month: 12, maxDay: 31 },
    ]

    constructor(newDate?: Date) {
        if(newDate) this.date = newDate;
        this.leapYear();
    }

    private leapYear() {
        let year = this.date.getFullYear();
        let isLeapYear = (year%4==0 || year%100==0 || year%400==0);

        if(isLeapYear) this.monthDaysMap[1].maxDay = 29;
    }

    public buildDate(year: number, month: number, day: number): Date {
        return new Date(`${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(3,'0')}`);
    }
    

    public adjustDateByDays(count: number): Date {
        const { day, month, year } = this.getDateParts();
        const currentMonthInfo = this.monthDaysMap.filter(v => v.month === month)[0];
        const nextDay = day + count;
        
        let yearAdjustment = year;
        let monthAdjustment = month;
        let dayAdjustment = nextDay;

        if(nextDay > currentMonthInfo.maxDay) {
            dayAdjustment = nextDay - currentMonthInfo.maxDay;
            monthAdjustment = currentMonthInfo.month === 12 ? 1 : month + 1;
            yearAdjustment = monthAdjustment === 1 ? year + 1: year;
        };

        if(nextDay <= 0) {
            const previousMonthInfo = currentMonthInfo.month == 1 ?
                this.monthDaysMap[11] : this.monthDaysMap[currentMonthInfo.month - 2];

            yearAdjustment = previousMonthInfo.month === 12 ? year -1 : year;
            monthAdjustment = previousMonthInfo.month
            dayAdjustment = previousMonthInfo.maxDay + nextDay;
        };
        
        return this.buildDate(yearAdjustment, monthAdjustment, dayAdjustment);
    }

    public adjustDateByMonth(count: number): Date {
        const { month, year } = this.getDateParts();
        let monthAdjustment = month + count;
        let yearAdjustment = year;

        if(month + count >= 13) {
            monthAdjustment = 1;
            yearAdjustment = year + 1;
        }

        if(month + count <= 0) {
            monthAdjustment = 12;
            yearAdjustment = year - 1;
        }

        return this.buildDate(yearAdjustment, monthAdjustment, 1);
    }

    public updateDate(newDate: Date) {
        this.date = newDate;
        this.leapYear();
    }

    public getDateParts(customDate?: Date): DateParts {
        let date = this.date;
        if(customDate) date = customDate;
        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
    }

    public getMonthName(): string {
        return this.months[this.date.getMonth()];
    }

    public shiftDateByView(count: number, typeView: CalendarView){
        let dateGenerated: Date = new Date();

        if(typeView == 'day') {
            dateGenerated = this.adjustDateByDays(count);
        }
        if(typeView == 'week') {
            dateGenerated = this.adjustDateByDays(count*7);
        }
        if(typeView=='month') {
            dateGenerated = this.adjustDateByMonth(count);
        }
        if(typeView=='year') {
            const { year } = this.getDateParts();
            dateGenerated = this.buildDate(year + count, 1, 1);
        }

        this.updateDate(dateGenerated);
    }
}
