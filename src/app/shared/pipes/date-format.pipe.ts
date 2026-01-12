import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null | undefined, format: 'short' | 'long' | 'datetime' = 'short'): string {
    if (!value) return '-';

    const date = typeof value === 'string' ? new Date(value) : value;

    switch (format) {
      case 'short':
        return date.toLocaleDateString('fr-MA');
      
      case 'long':
        return date.toLocaleDateString('fr-MA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'datetime':
        return date.toLocaleString('fr-MA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      default:
        return date.toLocaleDateString('fr-MA');
    }
  }
}
