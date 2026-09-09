import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PageShellComponent } from "../../../shared/components/page-shell.component/page-shell.component";
import { SiteNavComponent } from "../../../shared/components/site-nav.component/site-nav.component";

/**
 * Landing page for the storefront.
 * It introduces the brand and gives the user a clear entry point into the product catalog.
 */
@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, PageShellComponent, SiteNavComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
