import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import es from '@/i18n/es.json';
import { Router } from '@angular/router';
import { publicLayoutPage, staleTime } from '../../utils';
import { AboutUsService } from '../../services';
import { AboutUsApi, ReleaseLocalStorage } from '../../interfaces';
import { SafeHtmlPipe } from '../../pipes';
import { NgClass } from '@angular/common';
import { Spinner } from '@/shared/components/spinner/spinner';
import { ReleaseCode, ViewState } from '../../types';
import { LocalStorageService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'out-about-us-page',
  imports: [TitlePage, SafeHtmlPipe, NgClass, Spinner],
  templateUrl: './about-us-page.html',
  styleUrl: './about-us-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsPage {
  protected readonly i18n = es;
  private router = inject(Router);
  private aboutUsService = inject(AboutUsService);
  private localStorageService = inject(LocalStorageService);

  layoutPage = signal<string>(publicLayoutPage);
  releaseCodeLocalStorage = computed<ReleaseCode>(() => {
    if (this.localStorageService.getItem('release')) {
      const releaseLS: ReleaseLocalStorage = JSON.parse(
        this.localStorageService.getItem('release') ?? '',
      );
      return releaseLS.code;
    }
    return '';
  });

  readonly infoApi = injectQuery(() => ({
    queryKey: ['infoAboutUsApi'],
    queryFn: () => lastValueFrom(this.aboutUsService.getAboutUsInfo()),
    staleTime,
  }));
  info = computed<AboutUsApi>(
    () =>
      this.infoApi.data()?.find((item) => item.releaseCode === this.releaseCodeLocalStorage()) ??
      ({} as AboutUsApi),
  );
  viewState = computed<ViewState>(() => {
    if (this.infoApi.isLoading()) return 'loading';
    if (this.infoApi.isError()) return 'error';
    if (this.info()?.isPublished && !this.info()?.isDraft) return 'available';
    return 'empty';
  });

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
