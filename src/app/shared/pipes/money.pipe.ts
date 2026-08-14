import { Pipe, type PipeTransform } from '@angular/core';

import { environment } from '../../../environments/environment';

/** Currency formatting driven by environment config rather than per-component logic. */
@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat(environment.locale, {
    style: 'currency',
    currency: environment.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return this.formatter.format(value);
  }
}
