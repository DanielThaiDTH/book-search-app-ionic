import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullString'
})
export class NullStringPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if(!value) {
      return "";
    } else if (typeof (value) !== 'number' && typeof (value) !== 'string' && !Array.isArray(value)) {
      return "[Object]";
    } else if (Array.isArray(value)){
      return value[0]? value[0] : "";
    } else if (typeof (value) === 'string'){
      return value;
    } else if (typeof (value) === 'number'){
      return value.toString();
    }
  }

}
