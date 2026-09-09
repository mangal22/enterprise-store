import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SiteNavComponent } from "../shared/components/site-nav.component/site-nav.component";

/** Root Angular shell that keeps global navigation visible while routed pages change below it. */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SiteNavComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
