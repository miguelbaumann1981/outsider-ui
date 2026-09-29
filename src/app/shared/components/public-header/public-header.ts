import { Component, inject, signal } from '@angular/core';
import { IconMenu } from '../icon-menu/icon-menu';
import { MenuItem } from '@/shared/interfaces/menu-item.interface';
import es from '@/i18n/es.json';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SetInitReleaseService } from '@/core/services';

@Component({
  selector: 'out-public-header',
  imports: [IconMenu, RouterLink, RouterLinkActive],
  templateUrl: './public-header.html',
})
export class PublicHeader {
  private router = inject(Router);
  protected readonly i18n = es;
  private setInitReleasesService = inject(SetInitReleaseService);

  readonly releasesApi = this.setInitReleasesService.releases;

  menu = signal<MenuItem[]>([
    {
      text: this.i18n.menu.aboutUs,
      url: '/about-us',
      isActive: true,
    },
    {
      text: this.i18n.menu.allReleases,
      url: '/releases',
      isActive: (this.releasesApi.data()?.length ?? 0) > 1,
    },
    {
      text: this.i18n.menu.contact,
      url: '/contact',
      isActive: true,
    },
  ]);

  navigateToHomePage(): void {
    this.router.navigate(['/']);
  }
}
