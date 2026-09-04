import { Routes } from '@angular/router';

/**
 * Defines the app-level route map for the storefront.
 * Each route lazily loads a feature component so the application remains modular and lightweight.
 */
export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./features/cart/components/cart-page.component').then(m => m.CartPageComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/components/cart-checkout.component').then(m => m.CartCheckoutComponent) },
  { path: 'login', loadComponent: () => import('./features/account/account-page.component').then(m => m.AccountPageComponent), data: { mode: 'login' } },
  { path: 'register', loadComponent: () => import('./features/account/account-page.component').then(m => m.AccountPageComponent), data: { mode: 'register' } },
  { path: 'orders', loadComponent: () => import('./features/orders/order-history.component').then(m => m.OrderHistoryComponent) },
  { path: '**', redirectTo: '' }
];
