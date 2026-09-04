import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutRequest { customerId: string; total: number; }
export interface OrderResponse { id: string; customerId: string; total: number; status: string; createdAt?: string; }

/**
 * Provides the Angular app with order-placement and order-history API calls.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /**
   * Sends a checkout request to the order service.
   */
  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('http://localhost:8092/api/orders/checkout', request);
  }

  /**
   * Loads the order history for a given customer id.
   */
  history(customerId: string): Observable<OrderResponse[]> { return this.http.get<OrderResponse[]>(`http://localhost:8092/api/orders/history/${customerId}`); }
}
