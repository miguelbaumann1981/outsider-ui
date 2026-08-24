import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import es from '@/i18n/es.json';
import { Router } from '@angular/router';
import { publicLayoutPage } from '../../utils';
import { AboutUsService } from '../../services';
import { AboutUsApi } from '../../interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeHtmlPipe } from '../../pipes';
import { NgClass } from '@angular/common';

@Component({
  selector: 'out-about-us-page',
  imports: [TitlePage, SafeHtmlPipe, NgClass],
  templateUrl: './about-us-page.html',
  styles: `
    .content-info {
      p {
        margin-bottom: 1rem;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsPage implements OnInit {
  protected readonly i18n = es;
  router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private aboutUsService = inject(AboutUsService);

  layoutPage = signal<string>(publicLayoutPage);
  info = signal<AboutUsApi>({} as AboutUsApi);

  ngOnInit(): void {
    this.getAboutUsInfo();
  }

  getAboutUsInfo(): void {
    this.aboutUsService
      .getAboutUsInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.info.set(data);
      });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
