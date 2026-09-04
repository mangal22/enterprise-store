import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { CartItem, Product } from '../models/cart.models';

/**
 * Maintains the in-memory shopping cart for the storefront.
 * It tracks product quantities, count, and subtotal without changing the backend state until checkout.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => this.items().reduce((count, item) => count + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((total, item) => total + item.product.price * item.quantity, 0));

  /**
   * Adds a product to the cart and increases quantity when the item already exists.
   */
  add(product: Product): void {
    this.items.update(items => {
      const existing = items.find(item => item.product.id === product.id);
      return existing
        ? items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { product, quantity: 1 }];
    });
  }

  /**
   * Removes an item entirely from the cart by product id.
   */
  remove(productId: string): void { this.items.update(items => items.filter(item => item.product.id !== productId)); }

  /**
   * Adjusts the item quantity by a relative delta such as +1 or -1, removing the item if the quantity would become zero.
   */
  changeQuantity(productId: string, delta: number): void {
    this.items.update(items => items.flatMap(item => item.product.id === productId
      ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : [])
      : [item]));
  }
}
