import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, Credentials } from '../../core/services/auth.service';
import { PageShellComponent } from '../../shared/components/page-shell.component';
import { SiteNavComponent } from '../../shared/components/site-nav.component';

/**
 * Login and registration screen for the storefront.
 * It switches behavior based on the route mode and posts the right request to the account API.
 */
@Component({ selector: 'app-account-page', standalone: true, imports: [FormsModule, RouterLink, PageShellComponent, SiteNavComponent], template: `<app-page-shell><app-site-nav/><main class="account"><p class="kicker">NORTHSTAR ACCOUNT</p><h1>{{ isRegister ? 'Join the collection.' : 'Welcome back.' }}</h1><p class="intro">{{ isRegister ? 'Create an account to keep your orders together.' : 'Sign in to view your orders and check out faster.' }}</p>@if (error()) { <div class="error">{{ error() }}</div> }<form (ngSubmit)="submit()">@if (isRegister) { <label>Name<input name="name" [(ngModel)]="form.name" required /></label> }<label>Email<input name="email" type="email" [(ngModel)]="form.email" required /></label><label>Password<input name="password" type="password" [(ngModel)]="form.password" minlength="8" required /><small>Use at least 8 characters.</small></label><button class="submit" type="submit" [disabled]="busy()">{{ busy() ? 'Working...' : (isRegister ? 'Create account' : 'Sign in') }}</button></form><p class="switch">{{ isRegister ? 'Already have an account?' : 'New here?' }} <a [routerLink]="isRegister ? '/login' : '/register'">{{ isRegister ? 'Sign in' : 'Create an account' }}</a></p></main></app-page-shell>`, styles: `.account { max-width:30rem; margin:0 auto; padding:5rem 0; } .kicker { color:#c45d35; font:700 .7rem ui-monospace,monospace; letter-spacing:.12em; } h1 { color:#28483d; font:400 3.5rem/1 Georgia,serif; } .intro, .switch, small { color:#687269; font:.9rem/1.5 ui-sans-serif,system-ui,sans-serif; } form { margin-top:2rem; } label { display:block; margin:1.2rem 0; color:#526159; font:700 .7rem ui-monospace,monospace; text-transform:uppercase; } input { display:block; width:100%; margin-top:.4rem; padding:.9rem; border:1px solid #b9c9b7; background:#fffdf8; font:.95rem ui-sans-serif,system-ui,sans-serif; } small { display:block; margin-top:.35rem; text-transform:none; font-weight:400; } .submit { width:100%; padding:1rem; color:#fff; background:#28483d; border:0; font-weight:700; cursor:pointer; } .submit:disabled { opacity:.5; } .error { padding:.8rem; color:#8c3425; background:#f5d8cf; font:.8rem ui-sans-serif,system-ui,sans-serif; } .switch { margin-top:1.5rem; } a { color:#c45d35; }`, changeDetection: ChangeDetectionStrategy.OnPush })
export class AccountPageComponent {
  readonly auth = inject(AuthService); private readonly router = inject(Router); private readonly route = inject(ActivatedRoute); readonly busy = signal(false); readonly error = signal(''); readonly isRegister = this.route.snapshot.data['mode'] === 'register'; form: Credentials = { name: '', email: '', password: '' };

  /**
   * Submits the selected auth flow, then routes the user to the catalog on success.
   */
  submit(): void { this.busy.set(true); this.error.set(''); const request = this.isRegister ? this.auth.register(this.form) : this.auth.login(this.form); request.subscribe({ next: () => this.router.navigate(['/products']), error: (error: { error?: { message?: string } }) => { this.busy.set(false); this.error.set(error.error?.message ?? 'Unable to complete the request.'); } }); }
}
