import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, inject, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { Router } from '@angular/router';
import { publicLayoutPage } from '../../utils';

@Component({
  selector: 'out-about-us-page',
  imports: [TitlePage],
  templateUrl: './about-us-page.html',
})
export class AboutUsPage {
  protected readonly i18n = es;
  router = inject(Router);

  layoutPage = signal<string>(publicLayoutPage);

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
