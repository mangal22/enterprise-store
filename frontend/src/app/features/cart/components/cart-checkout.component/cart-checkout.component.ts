import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { OrderService } from "../../services/order.service";
import { AuthService } from "../../../../core/services/auth.service";
import { PageShellComponent } from "../../../../shared/components/page-shell.component/page-shell.component";

/**
 * Displays the cart contents and handles the final checkout action.
 * It reads the in-memory cart, optionally uses the logged-in user id, and submits the order to the backend.
 */
@Component({
  selector: "app-cart-checkout",
  standalone: true,
  imports: [CurrencyPipe, RouterLink, PageShellComponent],
  templateUrl: "./cart-checkout.component.html",
  styleUrls: ["./cart-checkout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCheckoutComponent {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  readonly busy = signal(false);
  readonly message = signal("");
  readonly error = signal("");

  /**
   * Sends the current cart subtotal to the order service for checkout.
   * On success, it shows a confirmation message; on failure, it exposes a simple error state.
   */
  placeOrder(): void {
    this.busy.set(true);
    this.message.set("");
    this.error.set("");
    this.orders
      .checkout({
        customerId: this.auth.user()?.userId ?? "",
        total: this.cart.subtotal(),
      })
      .subscribe({
        next: (order) => {
          this.busy.set(false);
          this.message.set("Order " + order.id + " confirmed.");
        },
        error: () => {
          this.busy.set(false);
          this.error.set("Checkout is unavailable.");
        },
      });
  }
}
