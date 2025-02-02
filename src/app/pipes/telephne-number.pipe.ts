import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telephoneNumber',
  standalone: true
})
export class TelephneNumberPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

}
