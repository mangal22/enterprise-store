import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Adds the JWT bearer token to outgoing HTTP requests when a user is logged in.
 * This keeps protected backend endpoints accessible without manual token handling in each call.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('access_token');
  return next(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request);
};
