import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNavComponent } from './shared/components/site-nav.component';

/** Root Angular shell that keeps global navigation visible while routed pages change below it. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteNavComponent],
  template: '<div class="app-frame"><app-site-nav /><router-outlet /></div>',
  styles: '.app-frame { min-height: 100vh; } app-site-nav { display: block; max-width: 76rem; margin: 0 auto; padding: 0 2rem; } app-page-shell app-site-nav { display: none; }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
