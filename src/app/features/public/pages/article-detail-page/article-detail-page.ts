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
import { ArticleCategory, Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { HomeService } from '../../services/home.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage, textTeal600 } from '../../utils';
import { AnyCategory } from '../../types';
import { ArticleDetail, LayoutArticlesApi } from '../../interfaces';
import { ImgFallbackDirective } from '../../directives';
import { Spinner } from '@/shared/components/spinner/spinner';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-article-detail-page',
  imports: [SafeHtmlPipe, TitlePage, ImgFallbackDirective, Spinner],
  templateUrl: './article-detail-page.html',
  styles: `
    .content-article,
    .content-info {
      p {
        margin-bottom: 1rem;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailPage implements OnInit {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  private homeService = inject(HomeService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  articleDetail = signal<ArticleDetail>({
    category: ArticleCategory.EDITORIAL,
    release: Release.CURRENT,
    slug: '',
  });
  articleSelected = signal<AnyCategory>({} as AnyCategory);
  layoutPage = signal<string>(publicLayoutPage);
  isLoadingArticle = signal(false);
  isLoadingLayout = signal(false);
  errorMessageApi = signal<string>('');
  layoutArticlesApi = signal<LayoutArticlesApi[]>([]);

  color = computed<string>(() => {
    return (
      this.layoutArticlesApi().find((elem) => elem.category === this.articleDetail().category)
        ?.color?.solid ?? textTeal600
    );
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
        release: params['release'],
        slug: params['slug'],
      });
    });
  }

  getArticleData(): void {
    this.isLoadingArticle.set(true);
    const { category, release, slug } = this.articleDetail();
    this.homeService
      .getArticleBySlug(release as Release, slug, category)
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
      .getLayoutArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (layoutData) => {
          this.layoutArticlesApi.set(layoutData);
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

  navigateToReleasePage(release: Release | string): void {
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
