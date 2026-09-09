import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Shared wrapper used across the app to give each page a consistent page width and spacing.
 * It simply projects the page content into a centered main container.
 */
@Component({
  selector: "app-page-shell",
  standalone: true,
  templateUrl: "./page-shell.component.html",
  styleUrls: ["./page-shell.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellComponent {}
