import { TitlePage } from '@/shared/components/title-page/title-page';
import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import es from '@/i18n/es.json';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, ShareSocialItem } from '@/features/public/interfaces';
import { HomeService } from '@/features/public/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { staleTime, textTeal600 } from '@/features/public/utils';
import { SafeHtmlPipe } from '@/features/public/pipes';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';

const SOCIAL_MEDIA: ShareSocialItem[] = [
  {
    social: 'Instagram',
    imgUrl: '/assets/images/logo-instagram.png',
    imgWidth: '34',
    imgAlt: 'Logo Instagram',
  },
  {
    social: 'Facebook',
    imgUrl: '/assets/images/logo-facebook.png',
    imgWidth: '22',
    imgAlt: 'Logo Facebook',
  },
  {
    social: 'WhatsApp',
    imgUrl: '/assets/images/logo-whatsapp.png',
    imgWidth: '30',
    imgAlt: 'Logo WhatsApp',
  },
  {
    social: 'X',
    imgUrl: '/assets/images/logo-X.png',
    imgWidth: '22',
    imgAlt: 'Logo X',
  },
  {
    social: 'LinkedIn',
    imgUrl: '/assets/images/logo-linkedin.png',
    imgWidth: '24',
    imgAlt: 'Logo LinkedIn',
  },
];

@Component({
  selector: 'out-article-preview-page',
  imports: [TitlePage, SafeHtmlPipe],
  templateUrl: './article-preview-page.html',
  styleUrl: '../../../public/pages/article-detail-page/article-detail-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticlePreviewPage {
  protected readonly i18n = es;
  private homeService = inject(HomeService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  activeParam = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });
  readonly selectedArticle = injectQuery(() => ({
    queryKey: ['release', this.activeParam()],
    queryFn: () => lastValueFrom(this.homeService.getArticleById(this.activeParam())),
    enabled: this.activeParam() !== '' && this.activeParam() !== 'new',
  }));
  readonly homeLayoutApi = injectQuery(() => ({
    queryKey: ['homeLayout'],
    queryFn: () => lastValueFrom(this.homeService.getHomeLayout()),
    staleTime,
  }));

  color = computed<string>(() => {
    const layoutFeatures =
      this.homeLayoutApi
        .data()
        ?.find((item) => item.releaseCode === this.selectedArticle.data()?.releaseCode)?.features ??
      [];
    return (
      layoutFeatures.find((elem) => elem.category === this.selectedArticle.data()?.category)?.color
        ?.solid ?? textTeal600
    );
  });
  socialMediaItems = computed<ShareSocialItem[]>(() =>
    SOCIAL_MEDIA.map((item) => ({ ...item, article: this.selectedArticle.data() })),
  );

  backToArticles(): void {
    this.router.navigate(['admin/articles-crud']);
  }
}
