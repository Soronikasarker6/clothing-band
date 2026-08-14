import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-pulse" aria-hidden="true">
      <div class="aspect-[3/4] w-full bg-linen"></div>
      <div class="mt-5 space-y-2.5">
        <div class="h-2 w-16 bg-linen"></div>
        <div class="h-3 w-3/4 bg-linen"></div>
        <div class="h-3 w-14 bg-linen"></div>
      </div>
    </div>
  `,
})
export class ProductCardSkeletonComponent {}
