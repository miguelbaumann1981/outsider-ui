import { Component, signal } from '@angular/core';
import { IconMenu } from '../icon-menu/icon-menu';
import { MenuItem } from '@/shared/interfaces/menu-item.interface';
import es from '@/i18n/es.json';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'out-public-header',
  imports: [IconMenu, RouterLink, RouterLinkActive],
  templateUrl: './public-header.html',
})
export class PublicHeader {
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
}
