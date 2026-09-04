import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Shared wrapper used across the app to give each page a consistent page width and spacing.
 * It simply projects the page content into a centered main container.
 */
@Component({
  selector: 'app-page-shell',
  standalone: true,
  template: '<main><ng-content /></main>',
  styles: 'main { max-width: 72rem; margin: 0 auto; padding: 2rem; }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageShellComponent {}
