import { IconMenu } from '@/shared/components/icon-menu/icon-menu';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import es from '@/i18n/es.json';
import { MenuItem } from '@/shared/interfaces/menu-item.interface';
import { LocalStorageService } from '@/core/services/local-storage.service';

@Component({
  selector: 'out-admin-header',
  imports: [IconMenu, RouterLink, RouterLinkActive],
  templateUrl: './admin-header.html',
})
export class AdminHeader {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  router = inject(Router);

  menu = signal<MenuItem[]>([
    {
      text: this.i18n.menu.articlesCrud,
      url: '/admin/articles-crud',
    },
    {
      text: this.i18n.menu.homeLayoutCrud,
      url: '/admin/home-layout-crud',
    },
    {
      text: this.i18n.menu.aboutUsCrud,
      url: '/admin/about-us-crud',
    },
    {
      text: this.i18n.menu.releasesCrud,
      url: '/admin/releases-crud',
    },
  ]);

  navigateToMainPage(): void {
    this.localStorageService.setItem('release', 'CURRENT');
    this.router.navigate(['/admin/releases-crud']);
  }
}
