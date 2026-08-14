import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { media } from '../../core/config/media.config';
import { BRAND } from '../../core/config/site.config';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MEN_PANEL, WOMEN_PANEL } from './home.content';
import { BrandStoryComponent } from './sections/brand-story.component';
import { CampaignComponent } from './sections/campaign.component';
import { EditorialPanelComponent } from './sections/editorial-panel.component';
import { HeroComponent } from './sections/hero.component';
import { NewsletterSectionComponent } from './sections/newsletter-section.component';
import { ProductRailComponent } from './sections/product-rail.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    SectionHeadingComponent,
    ProductGridComponent,
    ProductRailComponent,
    EditorialPanelComponent,
    CampaignComponent,
    BrandStoryComponent,
    NewsletterSectionComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
})
export class HomePage {
  private readonly products = inject(ProductService);
  private readonly seo = inject(SeoService);

  protected readonly menPanel = MEN_PANEL;
  protected readonly womenPanel = WOMEN_PANEL;

  private readonly newArrivalsResult = toSignal(this.products.newArrivals(8), {
    initialValue: null,
  });
  private readonly trendingResult = toSignal(this.products.trending(4), { initialValue: null });

  protected readonly newArrivals = computed(() => this.newArrivalsResult() ?? []);
  protected readonly newArrivalsLoading = computed(() => this.newArrivalsResult() === null);
  protected readonly trending = computed(() => this.trendingResult() ?? []);
  protected readonly trendingLoading = computed(() => this.trendingResult() === null);

  protected readonly assurances = [
    { title: 'Complimentary shipping', body: 'On every order over 15,000 tk, worldwide.' },
    { title: 'Thirty-day returns', body: 'Free returns and exchanges, no questions.' },
    { title: 'Made to last', body: 'Repairs offered on every piece we sell.' },
  ];

  constructor() {
    this.seo.apply({
      title: 'Premium fashion showroom',
      description: `${BRAND.name} — considered clothing for men and women. Editorial essentials in wool, cotton and denim, designed in ${BRAND.city}.`,
      image: media('hero', { width: 1200, ratio: '16:9' }),
      canonicalPath: '/',
    });
    this.seo.setStructuredData('organisation', {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: BRAND.name,
      slogan: BRAND.tagline,
      address: { '@type': 'PostalAddress', addressLocality: BRAND.city },
    });
  }
}
