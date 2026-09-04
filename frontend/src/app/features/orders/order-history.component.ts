import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderResponse, OrderService } from '../cart/services/order.service';
import { PageShellComponent } from '../../shared/components/page-shell.component';
import { SiteNavComponent } from '../../shared/components/site-nav.component';

/**
 * Displays the logged-in user's past orders.
 * It reads the current user id and requests the order history from the backend.
 */
@Component({ selector: 'app-order-history', standalone: true, imports: [CurrencyPipe, DatePipe, RouterLink, PageShellComponent, SiteNavComponent], template: `<app-page-shell><app-site-nav/><main class="history"><p class="kicker">YOUR ACCOUNT</p><h1>Order history</h1><p class="intro">A record of everything you have brought home.</p>@if (loading()) { <p>Loading orders...</p> } @else if (!orders().length) { <div class="empty">No orders yet. <a routerLink="/products">Start shopping →</a></div> } @else { @for (order of orders(); track order.id) { <article><div><strong>Order {{ order.id }}</strong><small>{{ order.status }} · {{ order.createdAt | date:'medium' }}</small></div><b>{{ order.total | currency }}</b></article> } }</main></app-page-shell>`, styles: `.history { padding:4rem 0 8rem; max-width:48rem; margin:0 auto; } .kicker { color:#c45d35; font:700 .7rem ui-monospace,monospace; letter-spacing:.12em; } h1 { color:#28483d; font:400 4rem/1 Georgia,serif; } .intro, .empty, small { color:#687269; font:.9rem/1.5 ui-sans-serif,system-ui,sans-serif; } article { display:flex; justify-content:space-between; gap:1rem; padding:1.2rem 0; border-top:1px solid #c9c5b8; } strong, small { display:block; } strong { color:#28483d; font:700 .85rem ui-sans-serif,system-ui,sans-serif; } small { margin-top:.3rem; font-size:.75rem; } b { font:1.2rem Georgia,serif; } a { color:#c45d35; }`, changeDetection: ChangeDetectionStrategy.OnPush })
export class OrderHistoryComponent implements OnInit { private readonly service = inject(OrderService); private readonly auth = inject(AuthService); readonly orders = signal<OrderResponse[]>([]); readonly loading = signal(true);

  /**
   * Loads the current user's orders as soon as the screen is initialized.
   */
  ngOnInit(): void { const id = this.auth.user()?.userId; if (!id) { this.loading.set(false); return; } this.service.history(id).subscribe({ next: orders => { this.orders.set(orders); this.loading.set(false); }, error: () => this.loading.set(false) }); } }
