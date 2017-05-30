import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumHours'
})
export class SumHoursPipe implements PipeTransform {

  transform(value: any, workdayOrProject: string): string {
    console.log("value is",value);
    console.log("workdayOrProject is",workdayOrProject);
    if (workdayOrProject === "workday") {
      if (value.length === 0) {
        return "0:00";
      }
      let hours : number[] = [];
      for (let participant of value) {
        if (typeof participant.totalTime === "object") {
          hours.push(participant.totalTime.hour*60 + participant.totalTime.minute);
        }
      }
      if (hours.length === 0) {
        return "0:00";
      }
      console.log(hours.reduce((x,y) => x + y),"total minutes");
      const totalMins = hours.reduce((x,y) => x + y);
      const hoursSum = Math.floor(totalMins/60);
      const minutesSum = totalMins % 60;
      return `${hoursSum}:${minutesSum}`;
    }
    return null;
  }

}
