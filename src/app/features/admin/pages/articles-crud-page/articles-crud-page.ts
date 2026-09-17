import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { LocalStorageService } from '@/core/services';
import { HomeService, ReleasesService } from '@/features/public/services';
import { Router } from '@angular/router';
import { ReleaseCode, ViewState } from '@/features/public/types';
import { Article, ArticlesApi, ReleasesApi } from '@/features/public/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Spinner } from '@/shared/components/spinner/spinner';
import { NgClass, UpperCasePipe } from '@angular/common';
import { ReleaseCodeSelect } from '../../interfaces';

@Component({
  selector: 'out-articles-crud-page',
  imports: [SubtitlePage, Spinner, NgClass, UpperCasePipe],
  templateUrl: './articles-crud-page.html',
})
export class ArticlesCrudPage implements OnInit {
  protected readonly i18n = es;
  private releasesService = inject(ReleasesService);
  private localStorageService = inject(LocalStorageService);
  private homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  isLoadingArticles = signal(false);
  releases = signal<ReleasesApi[]>([]);
  errorMessageApi = signal<string>('');
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  optionReleaseCodeSelected = signal<ReleaseCode>('');

  articlesFiltered = computed<Article[]>(() => {
    return this.optionReleaseCodeSelected() === ''
      ? this.articlesApi().articles
      : this.articlesApi().articles.filter(
          (item) => item.releaseCode === this.optionReleaseCodeSelected(),
        );
  });
  articlesQuantity = computed<number>(() => this.articlesFiltered()?.length);
  viewState = computed<ViewState>(() => {
    if (this.isLoadingArticles()) return 'loading';
    if (this.errorMessageApi()) return 'error';
    if (this.articlesFiltered()?.length > 0) return 'available';
    return 'empty';
  });
  currentRelease = computed<ReleasesApi>(() => {
    return this.releases().find((item) => item.isCurrentRelease) ?? ({} as ReleasesApi);
  });
  releasesCodeOptions = computed<ReleaseCodeSelect[]>(() => {
    return this.releases().map((item) => ({
      code: item.releaseCode,
      displayName: item.name,
      disabled: false,
    }));
  });

  ngOnInit(): void {
    this.getArticlesApi();
    this.getReleasesApi();
  }

  getArticlesApi(): void {
    this.isLoadingArticles.set(true);
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

  getReleasesApi(): void {
    this.isLoadingArticles.set(true);
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.releases.set(data.sort((a, b) => b.index - a.index) ?? []);
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

  onOptionCode(code: ReleaseCode): void {
    this.optionReleaseCodeSelected.set(code);
  }

  navigateToDetailForm(id: string): void {
    this.router.navigate([`/admin/articles-crud/${id}`]);
  }

  createNewArticle(): void {
    this.router.navigate([`/admin/articles-crud/new`]);
  }
}
