import {
  Directive,
  ElementRef,
  type OnDestroy,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Reveals a section once it enters the viewport. The observer is disconnected
 * after the first reveal, so scrolling stays cheap. Motion is suppressed
 * globally by the `prefers-reduced-motion` rule in `styles.css`.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[class.animate-fade-up]': 'revealed()',
    '[style.opacity]': 'revealed() ? null : 0',
  },
})
export class RevealDirective implements OnDestroy {
  /**
   * Stagger in milliseconds, for grids that should cascade. Accepts the bare
   * attribute form (`appReveal`) as well as `[appReveal]="120"`.
   */
  readonly appReveal = input<number, number | string>(0, {
    transform: (value) => Number(value) || 0,
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  protected readonly revealed = signal(false);

  constructor() {
    afterNextRender(() => this.observe());
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.revealed.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.observer?.disconnect();
          window.setTimeout(() => this.revealed.set(true), this.appReveal());
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
