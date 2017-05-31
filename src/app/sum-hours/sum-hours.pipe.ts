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
        if (participant.name !== "" && typeof participant.totalTime === "object") { //only add time for participants with names and a valid total time
          if (participant.totalTime.hour >= 0 && participant.totalTime.minute >= 0) { //negative times should not affect the time calculation
            hours.push(participant.totalTime.hour*60 + participant.totalTime.minute);
          }
        }
      }
      if (hours.length === 0) {
        return "0:00";
      }
      console.log(hours.reduce((x,y) => x + y),"total minutes");
      const totalMins = hours.reduce((x,y) => x + y);
      const hoursSum = Math.floor(totalMins/60);
      let minutesSum = totalMins % 60;
      let minutesSumOutput = minutesSum < 10 ? `0${minutesSum}` : minutesSum;
      return `${hoursSum}:${minutesSumOutput}`;
    }
    return null;
  }

}
