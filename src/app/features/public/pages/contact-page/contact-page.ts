import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import es from '@/i18n/es.json';
import { publicLayoutPage } from '../../utils';

@Component({
  selector: 'out-contact-page',
  imports: [TitlePage],
  templateUrl: './contact-page.html',
})
export class ContactPage {
  protected readonly i18n = es;
  router = inject(Router);

  layoutPage = signal<string>(publicLayoutPage);

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
