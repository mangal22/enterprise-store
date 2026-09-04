import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/components/page-shell.component';
import { SiteNavComponent } from '../../shared/components/site-nav.component';

/**
 * Landing page for the storefront.
 * It introduces the brand and gives the user a clear entry point into the product catalog.
 */
@Component({ selector: 'app-home', standalone: true, imports: [RouterLink, PageShellComponent, SiteNavComponent], template: `<app-page-shell><app-site-nav/><main class="hero"><p class="kicker">NORTHSTAR / EVERYDAY OBJECTS</p><h1>A calmer way to choose well.</h1><p>Thoughtful tools, considered objects, and a catalog that stays close to the people using it.</p><a routerLink="/products" class="cta">Explore the collection <span>→</span></a></main></app-page-shell>`, styles: `hero { max-width:52rem; padding:8rem 0 10rem; } .kicker { color:#c45d35; font:700 .7rem ui-monospace,monospace; letter-spacing:.12em; } h1 { margin:1rem 0; color:#28483d; font:400 clamp(3.5rem,9vw,7rem)/.9 Georgia,serif; } p:not(.kicker) { max-width:28rem; color:#687269; font:1.05rem/1.5 ui-sans-serif,system-ui,sans-serif; } .cta { display:inline-flex; gap:2rem; margin-top:1.5rem; padding:1rem 1.2rem; color:#fff; background:#c45d35; font:700 .8rem ui-sans-serif,system-ui,sans-serif; text-decoration:none; } .cta span { font-size:1.2rem; }`, changeDetection: ChangeDetectionStrategy.OnPush })
export class HomeComponent {}
