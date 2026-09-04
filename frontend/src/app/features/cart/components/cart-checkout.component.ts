import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageShellComponent } from '../../../shared/components/page-shell.component';

/**
 * Displays the cart contents and handles the final checkout action.
 * It reads the in-memory cart, optionally uses the logged-in user id, and submits the order to the backend.
 */
@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, PageShellComponent],
  template: `<app-page-shell><main class="checkout"><p class="kicker">YOUR BAG</p><h1>Cart and checkout</h1>@if (cart.cartItems().length === 0) { <section class="empty"><p>Your cart is empty.</p><a routerLink="/products">Continue shopping →</a></section> } @else { <section class="items">@for (item of cart.cartItems(); track item.product.id) { <article><div><strong>{{ item.product.name }}</strong><small>{{ item.quantity }} × {{ item.product.price | currency }}</small></div><div class="quantity"><button type="button" (click)="cart.changeQuantity(item.product.id, -1)">−</button><span>{{ item.quantity }}</span><button type="button" (click)="cart.changeQuantity(item.product.id, 1)">+</button></div></article> }</section><div class="summary"><span>Subtotal</span><strong>{{ cart.subtotal() | currency }}</strong></div>@if (message()) { <div class="notice">{{ message() }}</div> } @if (error()) { <div class="error">{{ error() }}</div> }<button class="place-order" type="button" (click)="placeOrder()" [disabled]="busy()">{{ busy() ? 'Processing...' : 'Place order' }} <span>→</span></button> }<a class="back" routerLink="/products">← Back to products</a></main></app-page-shell>`,
  styles: `.checkout { max-width: 44rem; margin: 0 auto; padding: 4rem 0 8rem; } .kicker { color:#c45d35; font:700 .7rem ui-monospace,monospace; letter-spacing:.12em; } h1 { color:#28483d; font:400 4rem/1 Georgia,serif; } .items { margin-top:2rem; border-top:1px solid #c9c5b8; } article { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.2rem 0; border-bottom:1px solid #c9c5b8; } strong, small { display:block; } strong { color:#28483d; font:700 .95rem ui-sans-serif,system-ui,sans-serif; } small, .empty { color:#687269; font:.85rem ui-sans-serif,system-ui,sans-serif; } small { margin-top:.3rem; font-family:ui-monospace,monospace; } .quantity { display:flex; align-items:center; gap:.8rem; } .quantity button { width:2rem; height:2rem; color:#28483d; background:#d9e4d5; border:0; font-size:1.1rem; cursor:pointer; } .summary { display:flex; justify-content:space-between; padding:1.5rem 0; font:.9rem ui-sans-serif,system-ui,sans-serif; } .summary strong { font:1.5rem Georgia,serif; } .place-order { display:flex; justify-content:space-between; width:100%; padding:1rem; color:#fff; background:#28483d; border:0; font-weight:700; cursor:pointer; } .place-order:disabled { opacity:.5; } .empty { padding:2rem; background:#fffdf8; border:1px dashed #c9c5b8; } a { color:#c45d35; text-decoration:none; } .back { display:inline-block; margin-top:2rem; font:700 .8rem ui-sans-serif,system-ui,sans-serif; } .notice, .error { margin-top:1rem; padding:.8rem; font:.8rem ui-sans-serif,system-ui,sans-serif; } .notice { background:#d9e4d5; } .error { color:#8c3425; background:#f5d8cf; }`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartCheckoutComponent {
  readonly cart = inject(CartService); private readonly orders = inject(OrderService); private readonly auth = inject(AuthService); readonly busy = signal(false); readonly message = signal(''); readonly error = signal('');

  /**
   * Sends the current cart subtotal to the order service for checkout.
   * On success, it shows a confirmation message; on failure, it exposes a simple error state.
   */
  placeOrder(): void { this.busy.set(true); this.message.set(''); this.error.set(''); this.orders.checkout({ customerId: this.auth.user()?.userId ?? '', total: this.cart.subtotal() }).subscribe({ next: order => { this.busy.set(false); this.message.set('Order ' + order.id + ' confirmed.'); }, error: () => { this.busy.set(false); this.error.set('Checkout is unavailable.'); } }); }
}
