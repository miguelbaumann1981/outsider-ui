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
import { ArticlesApi, LayoutArticlesApi, ReleaseObj } from '../../interfaces';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { Router } from '@angular/router';
import { Release } from '../../types';
import { Release as ReleaseEnum } from '../../enums/release.enum';
import { HomeService, ReleasesService } from '../../services';
import { SkeletonCard } from '@/shared/components/skeleton-card/skeleton-card';

@Component({
  selector: 'out-home-page',
  imports: [ArticleHomeCard, SkeletonCard],
  templateUrl: './home-page.html',
  styles: `
    .slogan {
      color: gray;
      line-height: 1.2;
      box-sizing: border-box;
      padding: 2%;
      width: 100%;
      text-align: center;
      perspective: 500px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba($color: #000, $alpha: 0.5);
      .title {
        font-size: clamp(2rem, 10rem, 4vw);
      }
      .subtitle {
        font-size: clamp(0.75rem, 6rem, 2.5vw);
      }
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
  releaseDefault = signal<Release>('current');
  releaseLocalStorage = computed<Release>(
    () => (this.localStorageService.getItem('release') as Release) ?? this.releaseDefault(),
  );
  releases = signal<ReleaseObj[]>([]);
  releaseName = computed<string>(() => {
    return this.releases().find((item) => item.release === this.releaseLocalStorage())?.name ?? '';
  });
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  layoutArticlesApi = signal<LayoutArticlesApi[]>([]);
  articlesRelease = computed<ArticleCard[]>(() => {
    const articles = this.articlesApi()?.articles ?? [];
    const layout = this.layoutArticlesApi() ?? [];

    return articles
      .map((item) => ({
        section: item.category,
        name: item.titleCategory,
        title: item.titleArticle,
        author: item.authorArticle,
        id: item.id,
        slug: item.slug,
        release: item.release as Release,
        imageUrl: item.image,
        position: layout.find((elem) => elem.category === item.category)?.position ?? 1,
        color: layout.find((elem) => elem.category === item.category)?.color?.solid ?? 'lightblue',
        hoverColor:
          layout.find((elem) => elem.category === item.category)?.color?.hover ?? '#FFDBD6',
      }))
      .sort((a, b) => a.position - b.position);
  });

  ngOnInit(): void {
    this.getArticlesHomePage();
    this.getLayoutArticles();
    this.getReleasesApi();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { SplitText } = await import('gsap/SplitText');
    gsap.registerPlugin(SplitText);

    const split = new SplitText('#slogan', {
      type: 'chars',
    });

    gsap.from(split.chars, {
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
      .getArticles(this.releaseLocalStorage() as unknown as ReleaseEnum)
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

  getReleasesApi(): void {
    this.isLoadingReleases.set(true);
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.releases.set(data?.releases);
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
    const { release, slug, section } = article;
    this.localStorageService.setItem('release', release);
    this.router.navigate([`/articles/${release}/${section}/${slug}`]);
  }
}
