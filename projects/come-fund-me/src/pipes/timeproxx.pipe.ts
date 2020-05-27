import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeproxx'
})
export class TimeproxxPipe implements PipeTransform {
  transform(value: number) {
    return this.timeproxx(value);
  }

  timeproxx(timestamp: number) {
    const base = { hour: 3600, minute: 60, day: 86400 };
    const timeNow = new Date().getTime()/1000;
    const margin = timeNow - (timestamp / 1000);

    let time = margin / base.hour;
    let result: any;

    if (time < 1) {
      let minutes = margin / base.minute;
      result = `${minutes} min`;
      if (minutes <= 0) {
        result = `Now`;
      }
      if (minutes === 1) {
        result = `1 min`;
      }
      if (Number.isInteger(minutes) === false) {
        minutes = Math.round(minutes);
        result = `${minutes} min`;
        if (minutes === 1) {
          result = `1 min`;
        }
        if (minutes <= 0) {
          result = `Now`;
        }
      }
    }

    if (time < 24 && time >= 1) {
      result = `${time} hr`;
      if (time === 1) {
        result = `1 hr`;
      }
      if (Number.isInteger(time) === false) {
        time = Math.round(time);
        result = `${time} hr`;
      }
    }

    if (time >= 24) {
      const days = margin / base.day;
      if (days >= 1 && days < 2) {
        result = `Yesterday`;
      }
      if (days >= 2 && days < 3) {
        result = `2d`;
      }
      if (days >= 3 && days < 4) {
        result = `3d`;
      }
      if (days >= 4 && days < 5) {
        result = `4d`;
      }
      if (days >= 5 && days < 6) {
        result = `5d`;
      }
      if (days >= 6 && days < 7) {
        result = `6d`;
      }
      if (days >= 7) {
        result = this.convertDate(timestamp);
      }
    }
    return result;
  }

  convertDate(timestamp: number) {
    const d = new Date(timestamp * 1000),
      // Convert the passed timestamp to milliseconds
      yyyy = d.getUTCFullYear(),
      mm = d.getUTCMonth() + 1,	// Months are zero based.
      dd = d.getUTCDate();
    let date: string, m = `${mm}`, ddd = `${dd}`;

      if (mm < 10) {
        m = `0${mm}`;
      }
      if (dd < 10) {
        ddd = `0${dd}`;
      }
    // ie: 21/02/2019
    date = `${ddd}/${m}/${yyyy}`;
    return date;
  }
}