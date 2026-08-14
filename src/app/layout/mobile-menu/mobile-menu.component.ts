import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { PRIMARY_NAV } from '../../core/config/site.config';
import { UiService } from '../../core/services/ui.service';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  private readonly ui = inject(UiService);

  protected readonly icons = ICONS;
  protected readonly nav = PRIMARY_NAV;
  protected readonly open = this.ui.menuOpen;
  protected readonly expanded = signal<string | null>(null);

  protected close(): void {
    this.ui.close();
  }

  protected toggleSection(label: string): void {
    this.expanded.update((current) => (current === label ? null : label));
  }
}
