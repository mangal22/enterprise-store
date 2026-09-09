import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../services/cart.service";
import { ProductPayload, ProductService } from "../../services/product.service";
import { RouterLink } from "@angular/router";
import { PageShellComponent } from "../../../../shared/components/page-shell.component/page-shell.component";
import { Product } from "../../models/cart.models";

/**
 * Product catalog page.
 * It loads products from the backend, lets the user add or edit catalog entries, and provides cart actions.
 */
@Component({
  selector: "app-cart-page",
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, PageShellComponent],
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly productService = inject(ProductService);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly message = signal("");
  readonly error = signal("");
  draft: ProductPayload = { name: "", description: "", price: 0, stock: 0 };

  /**
   * Loads the catalog when the screen is initialized.
   */
  ngOnInit(): void {
    this.loadProducts();
  }
  /**
   * Requests all products from the backend and updates the state with the result.
   */
  loadProducts(): void {
    this.loading.set(true);
    this.productService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          "Could not load products. Check Product Service on port 8091.",
        );
        this.loading.set(false);
      },
    });
  }

  /**
   * Opens the product editor in create mode with a blank form.
   */
  startCreate(): void {
    this.editingId.set(null);
    this.draft = { name: "", description: "", price: 0, stock: 0 };
    this.editing.set(true);
    this.clearFeedback();
  }
  /**
   * Opens the editor in edit mode with the selected product details loaded.
   */
  startEdit(product: Product): void {
    this.editingId.set(product.id);
    this.draft = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    };
    this.editing.set(true);
    this.clearFeedback();
  }

  /**
   * Closes the product editor without saving.
   */
  cancelEdit(): void {
    this.editing.set(false);
  }
  /**
   * Saves either a create or update request and refreshes the in-memory product list.
   */
  saveProduct(): void {
    this.saving.set(true);
    this.clearFeedback();
    const id = this.editingId();
    const request = id
      ? this.productService.update(id, this.draft)
      : this.productService.create(this.draft);
    request.subscribe({
      next: (product) => {
        this.products.update((products) =>
          id
            ? products.map((item) => (item.id === product.id ? product : item))
            : [product, ...products],
        );
        this.saving.set(false);
        this.editing.set(false);
        this.message.set(
          id ? "Product updated in MongoDB." : "Product added to MongoDB.",
        );
      },
      error: () => {
        this.saving.set(false);
        this.error.set("The product could not be saved.");
      },
    });
  }

  /**
   * Deletes a product and removes it from the local cart if it was present.
   */
  removeProduct(product: Product): void {
    if (!confirm("Delete " + product.name + "?")) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products.update((products) =>
          products.filter((item) => item.id !== product.id),
        );
        this.cart.remove(product.id);
        this.message.set("Product deleted from MongoDB.");
      },
      error: () => this.error.set("The product could not be deleted."),
    });
  }
  /**
   * Adds the selected product to the cart and shows a confirmation message.
   */
  addToCart(product: Product): void {
    this.cart.add(product);
    this.message.set(product.name + " added to your cart.");
  }

  /**
   * Removes a specific product from the cart.
   */
  removeFromCart(productId: string): void {
    this.cart.remove(productId);
  }
  /**
   * Adjusts the cart quantity for a product by a relative delta.
   */
  changeQuantity(productId: string, delta: number): void {
    this.cart.changeQuantity(productId, delta);
  }

  /**
   * Builds the initials shown on each product card.
   */
  initials(name: string): string {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  /**
   * Clears status feedback before a new action begins.
   */
  private clearFeedback(): void {
    this.message.set("");
    this.error.set("");
  }
}
