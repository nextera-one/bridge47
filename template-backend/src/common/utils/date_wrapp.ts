type Unit = 'DAY' | 'HOUR' | 'MILLI' | 'MINUTE' | 'MONTH' | 'SECOND' | 'YEAR';
export default class DateWrapper {
  private date: Date;

  constructor(date?: Date | number);
  constructor(year: number, month: number, day: number);
  constructor(yearOrDate?: any, month?: number, day?: number) {
    if (
      typeof yearOrDate === 'number' &&
      month !== undefined &&
      day !== undefined
    ) {
      this.date = new Date(yearOrDate, month, day);
    } else if (typeof yearOrDate === 'number') {
      this.date = new Date(yearOrDate);
    } else if (yearOrDate instanceof Date) {
      this.date = new Date(yearOrDate.getTime());
    } else {
      this.date = new Date();
    }
  }
  static formatDate(d: Date | number, format: string): string {
    const date = d instanceof Date ? d : new Date(d);

    const pad = (num) => (num < 10 ? `0${num}` : num);

    const replacements = {
      DD: pad(date.getDate()),
      MM: pad(date.getMonth() + 1), // +1 because months are 0-based
      YYYY: date.getFullYear(),
      HH: pad(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds()),
    };

    let formattedDate = format;
    for (const [key, value] of Object.entries(replacements)) {
      formattedDate = formattedDate.replace(key, value);
    }

    return formattedDate;
  }
  static format(d: Date | number, format: string): string {
    return DateWrapper.formatDate(d, format);
  }

  add(unit: Unit, quantity: number): DateWrapper {
    const newDate = new Date(this.date.getTime());
    switch (unit) {
      case 'MILLI':
        return new DateWrapper(newDate.getTime() + quantity);
      case 'SECOND':
        newDate.setSeconds(newDate.getSeconds() + quantity);
        break;
      case 'MINUTE':
        newDate.setMinutes(newDate.getMinutes() + quantity);
        break;
      case 'HOUR':
        newDate.setHours(newDate.getHours() + quantity);
        break;
      case 'DAY':
        newDate.setDate(newDate.getDate() + quantity);
        break;
      case 'MONTH':
        newDate.setMonth(newDate.getMonth() + quantity);
        break;
      case 'YEAR':
        newDate.setFullYear(newDate.getFullYear() + quantity);
        break;
      default:
        throw new Error('INVALID_UNIT_FOR_DATE_ADDITION');
    }
    return new DateWrapper(newDate);
  }

  // Convenience methods
  addDays(days: number): DateWrapper {
    return this.add('DAY', days);
  }

  addHours(hours: number): DateWrapper {
    return this.add('HOUR', hours);
  }

  // Additional methods for 'MINUTE', 'SECOND', 'MILLI', 'MONTH', 'YEAR' follow the same pattern.

  asDate(): Date {
    return new Date(this.date.getTime());
  }

  // Other methods (before, clearTime, clone, etc.) follow the class structure, adapting Java functionality to TypeScript/JavaScript.

  // Example method
  clearTime(): DateWrapper {
    const newDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
    );
    return new DateWrapper(newDate);
  }

  // Implement other methods as needed, following the patterns above.

  addMinutes(minutes: number): DateWrapper {
    return this.add('MINUTE', minutes);
  }

  addMillis(millis: number): DateWrapper {
    return this.add('MILLI', millis);
  }

  addMonths(months: number): DateWrapper {
    return this.add('MONTH', months);
  }

  addSeconds(seconds: number): DateWrapper {
    return this.add('SECOND', seconds);
  }

  addYears(years: number): DateWrapper {
    return this.add('YEAR', years);
  }

  before(dateWrapper: DateWrapper): boolean {
    return this.date.getTime() < dateWrapper.getTime();
  }

  clone(): DateWrapper {
    return new DateWrapper(new Date(this.date.getTime()));
  }

  getDate(): number {
    return this.date.getDate();
  }

  getDay(): number {
    return this.date.getDay();
  }

  getDayInWeek(): number {
    return this.getDay(); // Alias to getDay
  }

  getDayOfYear(): number {
    let dayCount = 0;
    for (let i = 0; i < this.date.getMonth(); ++i) {
      dayCount += new Date(this.date.getFullYear(), i + 1, 0).getDate();
    }
    return dayCount + this.date.getDate();
  }

  getDaysInMonth(): number {
    return new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0,
    ).getDate();
  }

  getFirstDayOfMonth(): DateWrapper {
    return new DateWrapper(
      new Date(this.date.getFullYear(), this.date.getMonth(), 1),
    );
  }

  getFullYear(): number {
    return this.date.getFullYear();
  }

  getHours(): number {
    return this.date.getHours();
  }

  getLastDateOfMonth(): DateWrapper {
    return new DateWrapper(
      new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0),
    );
  }

  getMilliseconds(): number {
    const clearTimeDate = this.clearTime().date;
    return this.date.getTime() - clearTimeDate.getTime();
  }

  getMinutes(): number {
    return this.date.getMinutes();
  }

  getMonth(): number {
    return this.date.getMonth();
  }

  getSeconds(): number {
    return this.date.getSeconds();
  }

  getTime(): number {
    return this.date.getTime();
  }

  resetTime(): DateWrapper {
    const date = this.asDate();
    date.setHours(12, 0, 0, 0);
    return new DateWrapper(date);
  }
  setSeconds(seconds: number): DateWrapper {
    this.date.setSeconds(seconds);
    return this;
  }
  toString(): string {
    return this.date.toString();
  }
  clearSeconds(): DateWrapper {
    this.date.setSeconds(0, 0);
    return this;
  }
}
