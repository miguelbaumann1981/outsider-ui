import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtmlPipe } from '../../pipes';
import { ArticleCategory } from '../../enums';
import { HomeService } from '../../services/home.service';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage, staleTime, textTeal600, WINDOW } from '../../utils';
import { ReleaseCode, ViewState } from '../../types';
import { Article, ArticleDetail, ReleaseLocalStorage, ShareSocialItem } from '../../interfaces';
import { ImgFallbackDirective } from '../../directives';
import { Spinner } from '@/shared/components/spinner/spinner';
import es from '@/i18n/es.json';
import { LocalStorageService } from '@/core/services';
import { ShareSocialService } from '../../services';
import { Meta, Title } from '@angular/platform-browser';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

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
  selector: 'out-article-detail-page',
  imports: [SafeHtmlPipe, TitlePage, ImgFallbackDirective, Spinner],
  templateUrl: './article-detail-page.html',
  styleUrl: './article-detail-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailPage implements OnInit {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  private homeService = inject(HomeService);
  private shareSocialService = inject(ShareSocialService);
  private activatedRoute = inject(ActivatedRoute);
  private meta = inject(Meta);
  private title = inject(Title);
  private _window = inject(WINDOW);
  private router = inject(Router);

  articleDetail = signal<ArticleDetail>({
    category: ArticleCategory.EDITORIAL,
    releaseCode: '',
    slug: '',
  });
  layoutPage = signal<string>(publicLayoutPage);

  readonly articleSelected = injectQuery(() => {
    const { releaseCode, slug } = this.articleDetail();
    return {
      queryKey: ['articleSelected', releaseCode, slug],
      queryFn: () => lastValueFrom(this.homeService.getArticleBySlug(releaseCode, slug)),
      staleTime,
    };
  });

  readonly homeLayoutApi = injectQuery(() => ({
    queryKey: ['homeLayoutApi'],
    queryFn: () => lastValueFrom(this.homeService.getHomeLayout()),
    staleTime,
  }));

  socialMediaItems = computed<ShareSocialItem[]>(() =>
    SOCIAL_MEDIA.map((item) => ({ ...item, article: this.articleSelected.data() })),
  );

  color = computed<string>(() => {
    const layoutFeatures =
      this.homeLayoutApi
        .data()
        ?.find((item) => item.releaseCode === this.articleSelected.data()?.releaseCode)?.features ??
      [];
    return (
      layoutFeatures.find((elem) => elem.category === this.articleDetail().category)?.color
        ?.solid ?? textTeal600
    );
  });
  viewState = computed<ViewState>(() => {
    if (this.homeLayoutApi.isLoading() || this.articleSelected.isLoading()) return 'loading';
    if (this.homeLayoutApi.isError() || this.articleSelected.isError()) return 'error';
    if (this.articleSelected.data() !== null) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.getRouteParams();
  }

  getRouteParams(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.articleDetail.set({
        category: params['category'],
        releaseCode: params['releaseCode'],
        slug: params['slug'],
      });
    });
  }

  navigateToReleasePage(releaseCode: ReleaseCode): void {
    const releaseLS: ReleaseLocalStorage = JSON.parse(
      this.localStorageService.getItem('release') ?? '',
    );

    this.router.navigate([releaseLS.isCurrent ? '/' : `/release/${releaseCode.toLowerCase()}`]);
  }

  addSocialMetatags(): void {
    this.title.setTitle(this.articleSelected.data()?.titleArticle ?? '');

    this.meta.updateTag({
      property: 'og:title',
      content: this.articleSelected.data()?.titleArticle ?? '',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: this.articleSelected.data()?.content ?? '',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.articleSelected.data()?.image ?? '',
    });
    this.meta.updateTag({ property: 'og:url', content: this._window?.location?.href });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: this.articleSelected.data()?.titleArticle ?? '',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: this.articleSelected.data()?.content ?? '',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: this.articleSelected.data()?.image ?? '',
    });
  }

  shareOnMedia(social: string): void | Promise<void> {
    const url = this._window?.location?.href;
    this.addSocialMetatags();

    switch (social) {
      case 'Instagram':
        return this.shareSocialService.shareOnInstagramMobile(
          url,
          this.articleSelected.data() ?? ({} as Article),
        );

      case 'Facebook':
        return this.shareSocialService.shareOnFacebook(url);

      case 'WhatsApp':
        return this.shareSocialService.shareOnWhatsApp(url);

      case 'X':
        return this.shareSocialService.shareOnX(
          url,
          this.articleSelected.data()?.titleArticle ?? '',
        );

      case 'LinkedIn':
        return this.shareSocialService.shareOnLinkedIn(url);
    }
  }
}
