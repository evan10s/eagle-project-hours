import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeBetween'
})
export class TimeBetweenPipe implements PipeTransform {

  transform(value: any, startTime?: any, endTime?: any): any {
    console.log("value is",value);
    console.log("startTime",startTime);
    console.log("endTime",endTime);
    return null;
  }

}
