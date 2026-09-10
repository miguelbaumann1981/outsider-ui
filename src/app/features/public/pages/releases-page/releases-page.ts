import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleAuthor, ArticlesApi, ReleaseLocalStorage, ReleasesApi } from '../../interfaces';
import { ReleaseMonthPipe } from '../../pipes';
import { Router } from '@angular/router';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { NgClass } from '@angular/common';
import es from '@/i18n/es.json';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage } from '../../utils';
import { ViewState, ArticleCategory, ReleaseCode } from '../../types';
import { HomeService, ReleasesService } from '../../services';
import { Spinner } from '@/shared/components/spinner/spinner';

@Component({
  selector: 'out-releases-page',
  imports: [NgClass, ReleaseMonthPipe, TitlePage, Spinner],
  templateUrl: './releases-page.html',
})
export class ReleasesPage implements OnInit {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  private releasesService = inject(ReleasesService);
  private homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  isLoadingReleases = signal(false);
  isLoadingArticles = signal(false);
  errorMessageApi = signal<string>('');
  releases = signal<ReleasesApi[]>([]);
  releaseCodeSelected = computed<ReleaseCode>(() => {
    if (this.localStorageService.getItem('release')) {
      const releaseLS: ReleaseLocalStorage = JSON.parse(
        this.localStorageService.getItem('release') ?? '',
      );
      return releaseLS.code;
    }
    return '';
  });
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  layoutPage = signal<string>(publicLayoutPage);
  viewState = computed<ViewState>(() => {
    if (this.isLoadingReleases() || this.isLoadingArticles()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.releases().length > 0) return 'available';
    return 'empty';
  });

  ngOnInit(): void {
    this.getArticlesData();
    this.getReleasesApi();
  }

  getReleasesApi(): void {
    this.isLoadingReleases.set(true);
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const info = data
            .map((item) => ({
              id: item.id,
              index: item.index,
              month: item.month,
              year: item.year,
              releaseCode: item.releaseCode,
              articles: this.getArticlesByRelease(item.releaseCode),
              name: item.name,
              isDraft: item.isDraft,
              isPublished: item.isPublished,
              isCurrentRelease: item.isCurrentRelease,
            }))
            .sort((a, b) => b.index - a.index);
          this.releases.set(info ?? []);
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

  getArticlesData(): void {
    this.isLoadingArticles.set(false);
    this.homeService
      .getAllArticles()
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

  getArticlesByRelease(code: ReleaseCode): ArticleAuthor[] {
    let articlesRelease: ArticleAuthor[] = [];

    this.articlesApi()?.articles?.map((item) => {
      if (item.releaseCode === code) {
        articlesRelease.push({
          title: item.titleArticle,
          slug: item.slug,
          author: item.authorArticle,
          category: item.category,
        });
      }
    });
    return articlesRelease;
  }

  navigateToReleasePage(code: ReleaseCode): void {
    const releaseLS: ReleaseLocalStorage = {
      code,
      isCurrent:
        this.releases().find((item) => item.releaseCode === code)?.isCurrentRelease ?? false,
    };
    this.localStorageService.setItem('release', JSON.stringify(releaseLS));
    this.router.navigate([releaseLS.isCurrent ? '/' : `/release/${code.toLowerCase()}`]);
  }

  navigateToArticleDetail(code: ReleaseCode, category: ArticleCategory, slug: string) {
    const releaseLS: ReleaseLocalStorage = {
      code,
      isCurrent:
        this.releases().find((item) => item.releaseCode === code)?.isCurrentRelease ?? false,
    };
    this.localStorageService.setItem('release', JSON.stringify(releaseLS));
    this.router.navigate([`/articles/${code.toLowerCase()}/${category}/${slug}`]);
  }
}
