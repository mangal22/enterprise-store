/**
 * Shared product model used by the storefront and cart state.
 * This matches the server-side product DTO and allows UI code to show prices, stock, and cart quantities.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  version: number;
}

/**
 * Represents one line item in the shopping cart.
 */
export interface CartItem { product: Product; quantity: number; }
