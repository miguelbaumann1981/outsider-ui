import {
  AfterViewInit,
  Component,
  signal,
  PLATFORM_ID,
  inject,
  OnInit,
  computed,
  DestroyRef,
} from '@angular/core';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';
import { ArticleCard } from '../../interfaces/article-card.interface';
import es from '@/i18n/es.json';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticlesApi, HomeLayoutApi, ReleaseLocalStorage, ReleasesApi } from '../../interfaces';
import { Router } from '@angular/router';
import { HomeService, ReleasesService } from '../../services';
import { SkeletonCard } from '@/shared/components/skeleton-card/skeleton-card';
import { ReleaseCode, ViewState } from '../../types';
import { LocalStorageService } from '@/core/services';

@Component({
  selector: 'out-home-page',
  imports: [ArticleHomeCard, SkeletonCard],
  templateUrl: './home-page.html',
  styles: `
    .title {
      font-size: clamp(3rem, 12rem, 7vw);
      line-height: 1.2;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
    }

    .slogan {
      color: gray;
      line-height: 1.2;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
      font-size: clamp(0.75rem, 6rem, 2.5vw);
    }
  `,
})
export class HomePage implements OnInit, AfterViewInit {
  protected readonly i18n = es;
  private homeService = inject(HomeService);
  private releasesService = inject(ReleasesService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private localStorageService = inject(LocalStorageService);
  router = inject(Router);

  title = signal('Outsider');
  isLoadingArticles = signal(false);
  isLoadingLayout = signal(false);
  isLoadingReleases = signal(false);
  errorMessageApi = signal<string>('');
  releaseCodeLocalStorage = computed<ReleaseCode>(() => {
    if (this.localStorageService.getItem('release')) {
      const releaseLS: ReleaseLocalStorage = JSON.parse(
        this.localStorageService.getItem('release') ?? '',
      );
      return releaseLS.code;
    }
    return '';
  });

  releases = signal<ReleasesApi[]>([]);
  releaseName = computed<string>(() => {
    return (
      this.releases().find((item) => item.releaseCode === this.releaseCodeLocalStorage())?.name ??
      ''
    );
  });
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  homeLayoutApi = signal<HomeLayoutApi[]>([]);
  articlesRelease = computed<ArticleCard[]>(() => {
    const articles = this.articlesApi()?.articles ?? [];
    const layoutFeatures =
      this.homeLayoutApi().find((item) => item.releaseCode === this.releaseCodeLocalStorage())
        ?.features ?? [];

    return articles
      .map((item) => ({
        category: item.category,
        name: item.titleCategory,
        title: item.titleArticle,
        author: item.authorArticle,
        id: item.id,
        slug: item.slug,
        releaseCode: item.releaseCode,
        imageUrl: item.image,
        position: layoutFeatures.find((elem) => elem.category === item.category)?.position ?? 0,
        color:
          layoutFeatures.find((elem) => elem.category === item.category)?.color?.solid ?? '#aaaaaa',
        hoverColor:
          layoutFeatures.find((elem) => elem.category === item.category)?.color?.hover ?? '#eeeeee',
      }))
      .sort((a, b) => a.position - b.position);
  });

  viewState = computed<ViewState>(() => {
    if (this.isLoadingReleases() || this.isLoadingArticles() || this.isLoadingLayout())
      return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.articlesRelease().length > 0) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.getArticlesHomePage();
    this.getHomeLayoutApi();
    this.getReleasesApi();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { SplitText } = await import('gsap/SplitText');
    gsap.registerPlugin(SplitText);

    const splitTitle = new SplitText('#title', {
      type: 'chars',
    });

    gsap.from(splitTitle.chars, {
      x: 150,
      opacity: 0,
      duration: 1.5,
      ease: 'power4',
      stagger: 0.04,
    });

    const splitSlogan = new SplitText('#slogan', {
      type: 'chars',
    });

    gsap.from(splitSlogan.chars, {
      x: 150,
      opacity: 0,
      duration: 0.7,
      ease: 'power4',
      stagger: 0.04,
    });
  }

  getArticlesHomePage(): void {
    this.isLoadingArticles.set(true);
    this.homeService
      .getArticles(this.releaseCodeLocalStorage())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (articlesData) => {
          this.articlesApi.set(articlesData);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingArticles.set(false);
        },
        complete: () => {
          this.isLoadingArticles.set(false);
        },
      });
  }

  getHomeLayoutApi(): void {
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

  getReleasesApi(): void {
    this.isLoadingReleases.set(true);
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.releases.set(data);
        },
        error: (error) => {
          this.errorMessageApi.set(error ?? this.i18n.common.serverError);
          this.isLoadingReleases.set(false);
        },
        complete: () => {
          this.isLoadingReleases.set(false);
        },
      });
  }

  navigateToDetail(article: ArticleCard) {
    const { releaseCode, slug, category } = article;
    const release: ReleaseLocalStorage = {
      code: releaseCode,
      isCurrent:
        this.releases().find((item) => item.releaseCode === releaseCode)?.isCurrentRelease ?? false,
    };
    this.localStorageService.setItem('release', JSON.stringify(release));
    this.router.navigate([`/articles/${releaseCode.toLowerCase()}/${category}/${slug}`]);
  }
}
