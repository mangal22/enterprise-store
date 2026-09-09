import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartService } from "../../../features/cart/services/cart.service";
import { AuthService } from "../../../core/services/auth.service";

/**
 * Shared top navigation displayed across pages.
 * It exposes routes, the current cart count, and the login/logout area.
 */
@Component({
  selector: "app-site-nav",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./site-nav.component.html",
  styleUrls: ["./site-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteNavComponent {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
}
