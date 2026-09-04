import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/cart.models';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
}

/**
 * Encapsulates all HTTP calls for the product catalog API.
 * This keeps the screen components focused on UI behavior rather than backend details.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8091/api/products';

  /**
   * Requests the full list of products from the product service.
   */
  list(): Observable<Product[]> { return this.http.get<Product[]>(this.apiUrl); }

  /**
   * Creates a new product in the catalog.
   */
  create(payload: ProductPayload): Observable<Product> { return this.http.post<Product>(this.apiUrl, payload); }

  /**
   * Updates an existing product using its id and the new payload.
   */
  update(id: string, payload: ProductPayload): Observable<Product> { return this.http.put<Product>(`${this.apiUrl}/${id}`, payload); }

  /**
   * Deletes a product from the catalog by id.
   */
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
