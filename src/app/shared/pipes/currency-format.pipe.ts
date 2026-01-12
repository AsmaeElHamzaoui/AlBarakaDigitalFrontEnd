import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency: string = 'DH'): string {
    if (value === null || value === undefined) {
      return '0.00 ' + currency;
    }

    return value.toLocaleString('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' ' + currency;
  }
}
