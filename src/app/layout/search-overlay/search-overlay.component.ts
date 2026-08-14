import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import type { Product } from '../../core/models/catalog.model';
import { MEN_CATEGORIES, POPULAR_SEARCHES, WOMEN_CATEGORIES } from '../../core/config/site.config';
import { ProductService } from '../../core/services/product.service';
import { SearchService } from '../../core/services/search.service';
import { UiService } from '../../core/services/ui.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ICONS } from '../../shared/icons';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, MoneyPipe, ImageFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  templateUrl: './search-overlay.component.html',
})
export class SearchOverlayComponent {
  private readonly ui = inject(UiService);
  private readonly products = inject(ProductService);
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);

  protected readonly icons = ICONS;
  protected readonly open = this.ui.searchOpen;
  protected readonly popular = POPULAR_SEARCHES;
  protected readonly recent = this.search.recentSearches;
  protected readonly categories = [...WOMEN_CATEGORIES.slice(0, 5), ...MEN_CATEGORIES.slice(0, 4)];

  protected readonly term = new FormControl('', { nonNullable: true });

  private readonly query = toSignal(
    this.term.valueChanges.pipe(
      startWith(''),
      map((value) => value.trim()),
      debounceTime(220),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  protected readonly suggestions = toSignal(
    this.term.valueChanges.pipe(
      startWith(''),
      map((value) => value.trim()),
      debounceTime(220),
      distinctUntilChanged(),
      switchMap((value) => (value.length < 2 ? of([]) : this.products.suggest(value, 6))),
    ),
    { initialValue: [] as readonly Product[] },
  );

  protected readonly hasQuery = computed(() => this.query().length >= 2);

  constructor() {
    // Clear the field each time the overlay is dismissed.
    effect(() => {
      if (!this.open()) this.term.setValue('', { emitEvent: false });
    });
  }

  protected close(): void {
    this.ui.close();
  }

  protected submit(): void {
    const value = this.query();
    if (value.length < 2) return;
    this.search.remember(value);
    this.close();
    void this.router.navigate(['/shop'], { queryParams: { search: value } });
  }

  protected useTerm(value: string): void {
    this.term.setValue(value);
  }

  protected clearRecent(): void {
    this.search.clear();
  }
}
