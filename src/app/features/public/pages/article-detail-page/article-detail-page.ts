import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtmlPipe } from '../../pipes';
import { ArticleCategory } from '../../enums';
import { HomeService } from '../../services/home.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage, textTeal600, WINDOW } from '../../utils';
import { ReleaseCode, ViewState } from '../../types';
import {
  Article,
  ArticleDetail,
  HomeLayoutApi,
  ReleaseLocalStorage,
  ShareSocialItem,
} from '../../interfaces';
import { ImgFallbackDirective } from '../../directives';
import { Spinner } from '@/shared/components/spinner/spinner';
import es from '@/i18n/es.json';
import { LocalStorageService } from '@/core/services';
import { ShareSocialService } from '../../services';
import { Meta, Title } from '@angular/platform-browser';

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
  private destroyRef = inject(DestroyRef);
  private meta = inject(Meta);
  private title = inject(Title);
  private _window = inject(WINDOW);
  router = inject(Router);

  articleDetail = signal<ArticleDetail>({
    category: ArticleCategory.EDITORIAL,
    releaseCode: '',
    slug: '',
  });
  articleSelected = signal<Article>({} as Article);
  layoutPage = signal<string>(publicLayoutPage);
  isLoadingArticle = signal(false);
  isLoadingLayout = signal(false);
  errorMessageApi = signal<string>('');
  homeLayoutApi = signal<HomeLayoutApi[]>([]);
  socialMediaItems = computed<ShareSocialItem[]>(() =>
    SOCIAL_MEDIA.map((item) => ({ ...item, article: this.articleSelected() })),
  );

  color = computed<string>(() => {
    const layoutFeatures =
      this.homeLayoutApi().find((item) => item.releaseCode === this.articleSelected().releaseCode)
        ?.features ?? [];
    return (
      layoutFeatures.find((elem) => elem.category === this.articleDetail().category)?.color
        ?.solid ?? textTeal600
    );
  });
  viewState = computed<ViewState>(() => {
    if (this.isLoadingLayout() || this.isLoadingArticle()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.articleSelected() !== null) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.getRouteParams();
    this.getLayoutArticles();
    this.getArticleData();
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

  getArticleData(): void {
    this.isLoadingArticle.set(true);
    const { releaseCode, slug } = this.articleDetail();
    this.homeService
      .getArticleBySlug(releaseCode, slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (article) => {
          this.articleSelected.set(article);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingArticle.set(false);
        },
        complete: () => {
          this.isLoadingArticle.set(false);
        },
      });
  }

  getLayoutArticles(): void {
    this.isLoadingLayout.set(true);
    this.homeService
      .getHomeLayout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (layoutData) => {
          this.homeLayoutApi.set(layoutData);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingLayout.set(false);
        },
        complete: () => {
          this.isLoadingLayout.set(false);
        },
      });
  }

  navigateToReleasePage(releaseCode: ReleaseCode): void {
    const releaseLS: ReleaseLocalStorage = JSON.parse(
      this.localStorageService.getItem('release') ?? '',
    );

    this.router.navigate([releaseLS.isCurrent ? '/' : `/release/${releaseCode.toLowerCase()}`]);
  }

  addSocialMetatags(): void {
    this.title.setTitle(this.articleSelected().titleArticle);

    this.meta.updateTag({ property: 'og:title', content: this.articleSelected().titleArticle });
    this.meta.updateTag({
      property: 'og:description',
      content: this.articleSelected().content,
    });
    this.meta.updateTag({ property: 'og:image', content: this.articleSelected().image });
    this.meta.updateTag({ property: 'og:url', content: this._window?.location?.href });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.articleSelected().titleArticle });
    this.meta.updateTag({ name: 'twitter:description', content: this.articleSelected().content });
    this.meta.updateTag({ name: 'twitter:image', content: this.articleSelected().image });
  }

  shareOnMedia(social: string): void | Promise<void> {
    const url = this._window?.location?.href;
    this.addSocialMetatags();

    switch (social) {
      case 'Instagram':
        return this.shareSocialService.shareOnInstagramMobile(url, this.articleSelected());

      case 'Facebook':
        return this.shareSocialService.shareOnFacebook(url);

      case 'WhatsApp':
        return this.shareSocialService.shareOnWhatsApp(url);

      case 'X':
        return this.shareSocialService.shareOnX(url, this.articleSelected().titleArticle);

      case 'LinkedIn':
        return this.shareSocialService.shareOnLinkedIn(url);
    }
  }
}
