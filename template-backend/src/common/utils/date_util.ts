// import * as moment from 'moment';
import * as moment from 'moment-timezone';

export default class DateUtil {
  public static format(date: Date | string | number): Date {
    try {
      if (typeof date === 'number') {
        return moment(new Date(date)).tz('Asia/Amman').toDate();
      }
      return (
        date.toString().includes(',')
          ? moment(
              new Date(
                date
                  .toString()
                  .toUpperCase()
                  .replace('AM', '')
                  .replace('PM', '')
                  .replace(',', '')
                  .trim(),
              ),
            )
              .tz('Asia/Amman')
              .toDate()
          : date
      ) as Date;
    } catch (e) {
      return new Date();
    }
  }
}
