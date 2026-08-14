import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { BRAND } from '../config/site.config';

export interface SeoTags {
  readonly title: string;
  readonly description: string;
  readonly image?: string;
  readonly canonicalPath?: string;
  readonly type?: 'website' | 'product' | 'article';
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply(tags: SeoTags): void {
    const fullTitle = `${tags.title} — ${BRAND.name}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: tags.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:type', content: tags.type ?? 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
    }
    if (tags.canonicalPath) {
      this.setCanonical(tags.canonicalPath);
    }
  }

  /** Injects a JSON-LD block, replacing any previous one with the same id. */
  setStructuredData(id: string, data: Record<string, unknown>): void {
    const elementId = `ld-${id}`;
    this.doc.getElementById(elementId)?.remove();
    const script = this.doc.createElement('script');
    script.id = elementId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  private setCanonical(path: string): void {
    const href = `${this.doc.location.origin}${path}`;
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
