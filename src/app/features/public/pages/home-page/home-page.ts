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
import { ArticlesApi, LayoutArticlesApi, ReleasesApi } from '../../interfaces';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { Router } from '@angular/router';
import { HomeService, ReleasesService } from '../../services';
import { SkeletonCard } from '@/shared/components/skeleton-card/skeleton-card';
import { ReleaseCode } from '../../types';

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
      background: linear-gradient(to right, #2c3e50, #0490b5);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      // color: transparent;
      // display: inline-block;
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
  releaseCodeDefault = signal<ReleaseCode>('XXX111' as ReleaseCode);
  releaseCodeLocalStorage = computed<ReleaseCode>(
    () => (this.localStorageService.getItem('release') as ReleaseCode) ?? this.releaseCodeDefault(),
  );
  releases = signal<ReleasesApi[]>([]);
  releaseName = computed<string>(() => {
    return (
      this.releases().find((item) => item.releaseCode === this.releaseCodeDefault())?.name ?? ''
    );
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
        releaseCode: item.releaseCode,
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
      .getArticles(this.releaseCodeDefault())
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
    const { releaseCode, slug, section } = article;
    this.localStorageService.setItem('release', releaseCode);
    this.router.navigate([`/articles/${releaseCode}/${section}/${slug}`]);
  }
}
