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
import { publicLayoutPage, textTeal600 } from '../../utils';
import { ReleaseCode, ViewState } from '../../types';
import { Article, ArticleDetail, HomeLayoutApi, ReleaseLocalStorage } from '../../interfaces';
import { ImgFallbackDirective } from '../../directives';
import { Spinner } from '@/shared/components/spinner/spinner';
import es from '@/i18n/es.json';
import { LocalStorageService } from '@/core/services';
import { ShareSocialService } from '../../services';
import { Meta, Title } from '@angular/platform-browser';

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

  addMetaTags(): void {
    this.title.setTitle(this.articleSelected().titleArticle);

    this.meta.updateTag({ property: 'og:title', content: this.articleSelected().titleArticle });
    this.meta.updateTag({
      property: 'og:description',
      content: this.articleSelected().titleCategory,
    });
    this.meta.updateTag({ property: 'og:image', content: this.articleSelected().image });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
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

          this.addMetaTags();
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

  shareLinkedin(): void {
    const url =
      'https://outsiderrevista.com/admin/articles/oct026/editorial/que-escritor-no-ha-fantaseado';
    this.shareSocialService.shareOnLinkedIn(url);
  }

  shareWhatsapp(): void {
    const url =
      'https://outsiderrevista.com/admin/articles/oct026/editorial/que-escritor-no-ha-fantaseado';
    this.shareSocialService.shareOnWhatsApp(url);
  }
}
