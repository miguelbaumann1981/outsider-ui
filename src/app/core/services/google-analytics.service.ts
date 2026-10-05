import { inject, Service } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Service()
export class GoogleAnalyticsService {
  private router = inject(Router);

  init() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('event', 'page_view', {
          page_title: document.title,
          page_path: event.urlAfterRedirects,
          page_location: window.location.href,
        });
      });
  }
}
