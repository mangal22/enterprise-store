import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { OrderResponse, OrderService } from "../../cart/services/order.service";
import { PageShellComponent } from "../../../shared/components/page-shell.component/page-shell.component";
import { SiteNavComponent } from "../../../shared/components/site-nav.component/site-nav.component";

/**
 * Displays the logged-in user's past orders.
 * It reads the current user id and requests the order history from the backend.
 */
@Component({
  selector: "app-order-history",
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    PageShellComponent,
    SiteNavComponent,
  ],
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent implements OnInit {
  private readonly service = inject(OrderService);
  private readonly auth = inject(AuthService);
  readonly orders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);

  /**
   * Loads the current user's orders as soon as the screen is initialized.
   */
  ngOnInit(): void {
    const id = this.auth.user()?.userId;
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.service.history(id).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
