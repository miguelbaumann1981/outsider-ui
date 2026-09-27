import { AboutUsApi } from '@/features/public/interfaces';
import { SafeHtmlPipe } from '@/features/public/pipes';
import { NgClass } from '@angular/common';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import es from '@/i18n/es.json';
import { AboutUsService } from '@/features/public/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { lastValueFrom, map } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { staleTime } from '@/features/public/utils';

@Component({
  selector: 'out-about-us-preview-page',
  imports: [SafeHtmlPipe, NgClass, TitlePage],
  templateUrl: './about-us-preview-page.html',
  styleUrl: '../../../public/pages/about-us-page/about-us-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsPreviewPage {
  protected readonly i18n = es;
  private aboutUsService = inject(AboutUsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  activeParam = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });
  readonly aboutUsApi = injectQuery(() => ({
    queryKey: ['infoAboutUsApi'],
    queryFn: () => lastValueFrom(this.aboutUsService.getAboutUsInfo()),
    staleTime,
  }));

  info = computed<AboutUsApi>(() => {
    return (
      this.aboutUsApi.data()?.find((item) => item.id === this.activeParam()) ?? ({} as AboutUsApi)
    );
  });

  backToAboutUsCrud(): void {
    this.router.navigate(['/admin/about-us-crud']);
  }
}
