import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ProductPayload, ProductService } from '../services/product.service';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../../shared/components/page-shell.component';
import { Product } from '../models/cart.models';

/**
 * Product catalog page.
 * It loads products from the backend, lets the user add or edit catalog entries, and provides cart actions.
 */
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, PageShellComponent],
  template: `
    <app-page-shell>
      <header class="topbar"><div><p class="kicker">NORTHSTAR / COMMERCE CONSOLE</p><h1>Everything useful, beautifully chosen.</h1><p class="lede">Browse the catalog, curate a cart, and manage the inventory that powers it.</p></div><div class="cart-badge"><span>{{ cart.itemCount() }}</span><small>items in cart</small></div></header>
      @if (message()) { <div class="notice">{{ message() }}</div> } @if (error()) { <div class="error">{{ error() }}</div> }
      <div class="workspace"><section class="catalog"><div class="section-heading"><div><p class="kicker">LIVE CATALOG</p><h2>Products</h2></div><button class="accent-button" type="button" (click)="startCreate()">+ Add product</button></div>
        @if (loading()) { <div class="empty-state">Loading the catalog...</div> } @else if (products().length === 0) { <div class="empty-state">No products yet. Add the first one.</div> } @else { <div class="product-grid">@for (product of products(); track product.id) { <article class="product-card"><div class="product-art"><span>{{ initials(product.name) }}</span></div><div class="product-copy"><p class="stock">{{ product.stock }} available</p><h3>{{ product.name }}</h3><p>{{ product.description }}</p></div><div class="product-footer"><strong>{{ product.price | currency }}</strong><div class="card-actions"><button class="text-button" type="button" (click)="startEdit(product)">Edit</button><button class="text-button danger" type="button" (click)="removeProduct(product)">Delete</button><button class="buy-button" type="button" (click)="addToCart(product)" [disabled]="product.stock === 0">Add to cart</button></div></div></article> }</div> }
      </section><aside class="side-panel">@if (editing()) { <form class="editor" (ngSubmit)="saveProduct()"><div class="section-heading compact"><div><p class="kicker">INVENTORY</p><h2>{{ editingId() ? 'Edit product' : 'New product' }}</h2></div><button class="close-button" type="button" (click)="cancelEdit()">×</button></div><label>Name<input name="name" [(ngModel)]="draft.name" required /></label><label>Description<textarea name="description" [(ngModel)]="draft.description" rows="3" required></textarea></label><div class="form-row"><label>Price<input name="price" type="number" min="0" step="0.01" [(ngModel)]="draft.price" required /></label><label>Stock<input name="stock" type="number" min="0" step="1" [(ngModel)]="draft.stock" required /></label></div><button class="accent-button full" type="submit" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Save product' }}</button></form> } @else { <div class="side-intro"><p class="kicker">YOUR BAG</p><h2>Cart summary</h2><p>Ready when you are.</p></div>@if (cart.cartItems().length === 0) { <div class="cart-empty">Your cart is waiting for its first pick.</div> } @else { @for (item of cart.cartItems(); track item.product.id) { <div class="cart-line"><div><strong>{{ item.product.name }}</strong><small>{{ item.quantity }} × {{ item.product.price | currency }}</small><div class="quantity"><button type="button" (click)="changeQuantity(item.product.id, -1)">−</button><span>{{ item.quantity }}</span><button type="button" (click)="changeQuantity(item.product.id, 1)">+</button></div></div><button class="close-button" type="button" (click)="removeFromCart(item.product.id)">×</button></div> } }<div class="total"><span>Subtotal</span><strong>{{ cart.subtotal() | currency }}</strong></div><a class="checkout-button" routerLink="/cart">Open cart to checkout <span>→</span></a> }</aside></div>
    </app-page-shell>
  `,
  styles: `:host { display: block; min-height: 100vh; background: #f4f1e8; } .topbar { display: flex; justify-content: space-between; gap: 2rem; align-items: end; padding: 3.5rem 0 3rem; border-bottom: 1px solid #c9c5b8; } .kicker { color: #c45d35; font: 700 .7rem/1.2 ui-monospace, monospace; letter-spacing: .12em; margin: 0 0 .7rem; } h1, h2, h3, p { margin-top: 0; } h1 { max-width: 38rem; margin-bottom: .8rem; font: 400 clamp(2.5rem, 6vw, 5rem)/.95 Georgia, serif; } h2 { margin-bottom: 0; font: 400 2.2rem/1 Georgia, serif; } h3 { margin: .3rem 0 .35rem; font: 600 1.25rem/1.1 Georgia, serif; } .lede { max-width: 32rem; color: #687269; font: 1rem/1.5 ui-sans-serif, system-ui, sans-serif; } .cart-badge { display: grid; place-items: center; min-width: 7rem; aspect-ratio: 1; border: 1px solid #c9c5b8; border-radius: 50%; background: #d9e4d5; } .cart-badge span { font: 2.5rem Georgia, serif; } .cart-badge small { margin-top: -1.4rem; color: #687269; font: .7rem ui-monospace, monospace; } .notice, .error { padding: .8rem 1rem; margin: 1.25rem 0 0; font: .85rem ui-sans-serif, system-ui, sans-serif; } .notice { background: #d9e4d5; } .error { color: #8c3425; background: #f5d8cf; } .workspace { display: grid; grid-template-columns: minmax(0, 1fr) 20rem; gap: 3rem; padding: 3rem 0; } .section-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; } .compact { align-items: center; } button { border: 0; font: 600 .75rem ui-sans-serif, system-ui, sans-serif; cursor: pointer; } button:disabled { cursor: not-allowed; opacity: .45; } .accent-button { padding: .8rem 1.1rem; color: #fff; background: #c45d35; } .accent-button:hover { background: #a94628; } .full { width: 100%; margin-top: 1rem; } .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; } .product-card { display: flex; flex-direction: column; min-height: 25rem; background: #fffdf8; border: 1px solid #ded9cc; } .product-art { display: grid; place-items: center; aspect-ratio: 1.35; color: #f4f1e8; background: #28483d; font: 3rem Georgia, serif; } .product-copy { padding: 1.1rem .1rem .4rem 1.1rem; flex: 1; } .product-copy p:not(.stock) { color: #7a8179; font: .83rem/1.45 ui-sans-serif, system-ui, sans-serif; } .stock { color: #c45d35; font: 700 .65rem ui-monospace, monospace; text-transform: uppercase; } .product-footer { display: flex; gap: .75rem; align-items: end; justify-content: space-between; padding: 1rem 1.1rem; border-top: 1px solid #ebe7dd; } .product-footer strong { white-space: nowrap; font: 1.2rem Georgia, serif; } .card-actions { display: flex; flex-wrap: wrap; justify-content: end; gap: .35rem; } .buy-button { padding: .55rem .65rem; color: #fff; background: #28483d; } .text-button { padding: .55rem .4rem; color: #28483d; background: transparent; text-decoration: underline; } .text-button.danger { color: #a94628; } .side-panel { align-self: start; position: sticky; top: 1.5rem; padding: 1.4rem; background: #d9e4d5; border-top: 4px solid #28483d; } .side-intro p:not(.kicker), .cart-empty { color: #687269; font: .85rem/1.4 ui-sans-serif, system-ui, sans-serif; } .cart-empty { padding: 2rem 0; } .cart-line { display: flex; justify-content: space-between; gap: 1rem; padding: .9rem 0; border-top: 1px solid #b9c9b7; } .cart-line strong, .cart-line small { display: block; } .cart-line strong { font: .85rem ui-sans-serif, system-ui, sans-serif; } .cart-line small { color: #687269; margin-top: .25rem; font: .75rem ui-monospace, monospace; } .close-button { width: 1.6rem; height: 1.6rem; color: #28483d; background: transparent; font-size: 1.3rem; } .total { display: flex; justify-content: space-between; padding: 1.2rem 0; margin-top: .6rem; border-top: 1px solid #9fb39e; font: .8rem ui-sans-serif, system-ui, sans-serif; } .total strong { font: 1.35rem Georgia, serif; } .checkout-button { display: flex; justify-content: space-between; width: 100%; padding: 1rem; color: #fff; background: #28483d; } .checkout-button span { font-size: 1.2rem; } .editor label { display: block; margin-top: 1rem; color: #526159; font: 700 .7rem ui-monospace, monospace; text-transform: uppercase; } input, textarea { display: block; width: 100%; margin-top: .35rem; padding: .75rem; color: #18251f; background: #fffdf8; border: 1px solid #b9c9b7; font: .9rem ui-sans-serif, system-ui, sans-serif; } .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; } .empty-state { padding: 3rem 1rem; color: #687269; background: #fffdf8; border: 1px dashed #c9c5b8; text-align: center; font: .9rem ui-sans-serif, system-ui, sans-serif; } @media (max-width: 780px) { .topbar { align-items: start; flex-direction: column; padding-top: 2rem; } .cart-badge { width: 5.5rem; min-width: 5.5rem; } .cart-badge span { font-size: 1.8rem; } .workspace { grid-template-columns: 1fr; gap: 2rem; padding-top: 2rem; } .side-panel { position: static; } }`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly productService = inject(ProductService);
  readonly products = signal<Product[]>([]); readonly loading = signal(true); readonly saving = signal(false); readonly editing = signal(false); readonly editingId = signal<string | null>(null); readonly message = signal(''); readonly error = signal('');
  draft: ProductPayload = { name: '', description: '', price: 0, stock: 0 };

  /**
   * Loads the catalog when the screen is initialized.
   */
  ngOnInit(): void { this.loadProducts(); }
  /**
   * Requests all products from the backend and updates the state with the result.
   */
  loadProducts(): void { this.loading.set(true); this.productService.list().subscribe({ next: products => { this.products.set(products); this.loading.set(false); }, error: () => { this.error.set('Could not load products. Check Product Service on port 8091.'); this.loading.set(false); } }); }

  /**
   * Opens the product editor in create mode with a blank form.
   */
  startCreate(): void { this.editingId.set(null); this.draft = { name: '', description: '', price: 0, stock: 0 }; this.editing.set(true); this.clearFeedback(); }
  /**
   * Opens the editor in edit mode with the selected product details loaded.
   */
  startEdit(product: Product): void { this.editingId.set(product.id); this.draft = { name: product.name, description: product.description, price: product.price, stock: product.stock }; this.editing.set(true); this.clearFeedback(); }

  /**
   * Closes the product editor without saving.
   */
  cancelEdit(): void { this.editing.set(false); }
  /**
   * Saves either a create or update request and refreshes the in-memory product list.
   */
  saveProduct(): void { this.saving.set(true); this.clearFeedback(); const id = this.editingId(); const request = id ? this.productService.update(id, this.draft) : this.productService.create(this.draft); request.subscribe({ next: product => { this.products.update(products => id ? products.map(item => item.id === product.id ? product : item) : [product, ...products]); this.saving.set(false); this.editing.set(false); this.message.set(id ? 'Product updated in MongoDB.' : 'Product added to MongoDB.'); }, error: () => { this.saving.set(false); this.error.set('The product could not be saved.'); } }); }

  /**
   * Deletes a product and removes it from the local cart if it was present.
   */
  removeProduct(product: Product): void { if (!confirm('Delete ' + product.name + '?')) return; this.productService.delete(product.id).subscribe({ next: () => { this.products.update(products => products.filter(item => item.id !== product.id)); this.cart.remove(product.id); this.message.set('Product deleted from MongoDB.'); }, error: () => this.error.set('The product could not be deleted.') }); }
  /**
   * Adds the selected product to the cart and shows a confirmation message.
   */
  addToCart(product: Product): void { this.cart.add(product); this.message.set(product.name + ' added to your cart.'); }

  /**
   * Removes a specific product from the cart.
   */
  removeFromCart(productId: string): void { this.cart.remove(productId); }
  /**
   * Adjusts the cart quantity for a product by a relative delta.
   */
  changeQuantity(productId: string, delta: number): void { this.cart.changeQuantity(productId, delta); }

  /**
   * Builds the initials shown on each product card.
   */
  initials(name: string): string { return name.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase(); }

  /**
   * Clears status feedback before a new action begins.
   */
  private clearFeedback(): void { this.message.set(''); this.error.set(''); }
}
