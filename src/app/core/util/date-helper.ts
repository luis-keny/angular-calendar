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

    private leapYear(dateSelect?: Date) {
        let year = dateSelect?.getFullYear() ?? this.date.getFullYear();
        let isLeapYear = (year%4==0 || year%100==0 || year%400==0);

        if(isLeapYear) {
            this.monthDaysMap[1].maxDay = 29;
            return
        }
        this.monthDaysMap[1].maxDay = 28;
    }

    public buildDate(year: number, month: number, day: number): Date {
        return new Date(`${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(3,'0')}`);
    }
    

    public adjustDateByDays(count: number, dateSelected?: Date): Date {
        let date = dateSelected ?? this.date;
        this.leapYear(date);
        const { day, month, year } = this.getDateParts(date);
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

    public getMonthName(monthNumber?: number): string {
        const identifiedMonth = monthNumber ?? this.date.getMonth();
        return this.months[identifiedMonth];
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

    public lastDayOfMonth(dateSelected?: Date) {
        let date = dateSelected ?? this.date;
        const { month } = this.getDateParts(date);
        const currentMonthInfo = this.monthDaysMap.filter(v => v.month === month)[0];

        return currentMonthInfo.maxDay;
    }

    public getWeekForDate(dateSelected?: Date): Date[] {
        let week: Date[] = [];
        let date = dateSelected ?? this.date;
        this.leapYear(date);

        for(let i = 0; i < 7; i++) {
            let orderDay: Date = this.adjustDateByDays(i - date.getDay(), date);
            week.push(orderDay);
        }

        return week;
    }

    public getWeekDayNames(week: Date[]): string[] {
        let weekDayNames: string[] = [];

        week.map(day => {
            const name = day.toString().split(" ")[0];
            weekDayNames.push(name);
        });

        return weekDayNames;
    }

    public getMonthForDate(dateSelected?: Date, minWeek?: number): Date[][] {
        let date = dateSelected ?? this.date;
        this.leapYear(date);
        let monthWeeks: Date[][] = [];
        const { month, year } = this.getDateParts(date);
    
        let lastDayOfMonth: number = this.lastDayOfMonth(date);
        let weekStartDate = this.buildDate(year,month,1);
        let weekEndDate: Date = weekStartDate;
        let count = minWeek ?? 0;
    
        date = weekStartDate;

        do{
            let daysOfWeek: Date[] = this.getWeekForDate(weekStartDate);
            weekEndDate = daysOfWeek[daysOfWeek.length - 1];
            weekStartDate = this.adjustDateByDays(1, weekEndDate);
            monthWeeks.push(daysOfWeek);
            count--;
        } while(!(
            (
            weekEndDate.getDate() == lastDayOfMonth ||
            weekEndDate.getMonth() > date.getMonth() ||
            weekEndDate.getFullYear() > date.getFullYear()
            ) && count<=0
        ));

        return monthWeeks;
    }

    public getYearByDate(dateSelected: Date, minWeek?: number): Date[][][] {
        let yearMonth: Date[][][] = [];
        const { year } = this.getDateParts(dateSelected);
        this.leapYear(dateSelected);
        for(let i = 0; i < 12; i ++) {
            let firstDayOfMonth = this.buildDate(year,i+1,1);
            let month = this.getMonthForDate(firstDayOfMonth, minWeek);
            yearMonth.push(month);
        }

        return yearMonth;
    }
}
