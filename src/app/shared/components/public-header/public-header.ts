import { Component, inject, signal } from '@angular/core';
import { IconMenu } from '../icon-menu/icon-menu';
import { MenuItem } from '@/shared/interfaces/menu-item.interface';
import es from '@/i18n/es.json';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Release } from '@/features/public/enums';
import { LocalStorageService } from '@/core/services/local-storage.service';

@Component({
  selector: 'out-public-header',
  imports: [IconMenu, RouterLink, RouterLinkActive],
  templateUrl: './public-header.html',
})
export class PublicHeader {
  private localStorageService = inject(LocalStorageService);
  router = inject(Router);
  protected readonly i18n = es;

  menu = signal<MenuItem[]>([
    {
      text: this.i18n.menu.aboutUs,
      url: '/about-us',
    },
    {
      text: this.i18n.menu.lastReleases,
      url: '/releases',
    },
    {
      text: this.i18n.menu.contact,
      url: '/contact',
    },
  ]);

  navigateToHomePage(): void {
    this.localStorageService.setItem('release', Release.CURRENT);
    this.router.navigate(['/']);
  }
}
