import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService, Credentials } from "../../../core/services/auth.service";
import { PageShellComponent } from "../../../shared/components/page-shell.component/page-shell.component";
import { SiteNavComponent } from "../../../shared/components/site-nav.component/site-nav.component";

/**
 * Login and registration screen for the storefront.
 * It switches behavior based on the route mode and posts the right request to the account API.
 */
@Component({
  selector: "app-account-page",
  standalone: true,
  imports: [FormsModule, RouterLink, PageShellComponent, SiteNavComponent],
  templateUrl: "./account-page.component.html",
  styleUrls: ["./account-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly busy = signal(false);
  readonly error = signal("");
  readonly isRegister = this.route.snapshot.data["mode"] === "register";
  readonly showPassword = signal(false);
  form: Credentials = { name: "", email: "", password: "" };

  /**
   * Submits the selected auth flow, then routes the user to the catalog on success.
   */
  submit(): void {
    this.busy.set(true);
    this.error.set("");
    const request = this.isRegister
      ? this.auth.register(this.form)
      : this.auth.login(this.form);
    request.subscribe({
      next: () => this.router.navigate(["/products"]),
      error: (error: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(
          error.error?.message ?? "Unable to complete the request.",
        );
      },
    });
  }
}
