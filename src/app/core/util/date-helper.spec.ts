import { DateHelper } from "./date-helper";

describe('DateHelper', () => {
  const dateHelper = new DateHelper();

  it('should be created', () => {
    expect(dateHelper).toBeTruthy();
  });

  it('should return days in range', () => {
    const startDate = new Date(2022, 0, 1);
    const endDate = new Date(2022, 0, 5);
    const daysInRange: Date[] = dateHelper.getDaysInRange(startDate, endDate);
    let daysString: string[] = [];
    daysInRange.forEach(day => daysString.push(dateHelper.dateToStringFormat(day)));
    expect(daysString).toEqual(['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', '2022-01-05']);
  });

  it('should return days in range with start and end in the same day', () => {
    const startDate = new Date(2025, 0, 8);
    const endDate = new Date(2025, 0, 8);
    const daysInRange: Date[] = dateHelper.getDaysInRange(startDate, endDate);
    let daysString: string[] = [];
    daysInRange.forEach(day => daysString.push(dateHelper.dateToStringFormat(day)));
    expect(daysString).toEqual(['2025-01-08']);
    expect(daysInRange[0]).toEqual(new Date(2025, 0, 8));
  });

  it('should return week for date', () => {
    const date = new Date(2022, 0, 1);
    const week: Date[] = dateHelper.getWeekForDate(date);
    let weekString: string[] = [];
    week.forEach(day => weekString.push(dateHelper.dateToStringFormat(day)));
    expect(weekString).toEqual(['2021-12-26', '2021-12-27', '2021-12-28', '2021-12-29', '2021-12-30', '2021-12-31', '2022-01-01']);
  });

  it('should return true if date is in range', () => {
    const date = new Date(2025, 0, 10);
    const start = new Date("2025-01-10T10:00:00.000-05:00");
    const end = new Date("2025-01-11T11:00:00.000-05:00");
    const dayInRange = dateHelper.isDateInRange(date, start, end);
    expect(dayInRange).toBeTruthy();
  })
});