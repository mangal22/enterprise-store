import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../features/cart/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * Shared top navigation displayed across pages.
 * It exposes routes, the current cart count, and the login/logout area.
 */
@Component({ selector: 'app-site-nav', standalone: true, imports: [RouterLink], template: `<nav><a class="brand" routerLink="/">NORTHSTAR</a><div class="links"><a routerLink="/">Home</a><a routerLink="/products">Products</a><a routerLink="/orders">Order history</a><a class="cart-link" routerLink="/cart" aria-label="Open cart">Cart <span>{{ cart.itemCount() }}</span></a>@if (auth.isLoggedIn()) { <span class="welcome">Hi, {{ auth.user()?.name }}</span><button type="button" (click)="auth.logout()">Sign out</button> } @else { <a routerLink="/login">Login</a><a class="join" routerLink="/register">Register</a> }</div></nav>`, styles: `nav { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.3rem 0; border-bottom:1px solid #c9c5b8; } .brand { color:#28483d; font:700 .9rem ui-monospace,monospace; letter-spacing:.12em; text-decoration:none; } .links { display:flex; align-items:center; gap:1rem; } a, button { color:#28483d; background:transparent; border:0; font:600 .75rem ui-sans-serif,system-ui,sans-serif; text-decoration:none; cursor:pointer; } .cart-link { display:inline-flex; align-items:center; gap:.35rem; } .cart-link span { display:grid; place-items:center; min-width:1.25rem; height:1.25rem; padding:0 .25rem; color:#fff; background:#c45d35; border-radius:50%; font-size:.65rem; } .join { padding:.6rem .8rem; color:#fff; background:#28483d; } .welcome { color:#687269; font:.75rem ui-monospace,monospace; } @media(max-width:760px){nav{align-items:flex-start;flex-direction:column}.links{flex-wrap:wrap}}`, changeDetection: ChangeDetectionStrategy.OnPush })
export class SiteNavComponent { readonly auth = inject(AuthService); readonly cart = inject(CartService); }
