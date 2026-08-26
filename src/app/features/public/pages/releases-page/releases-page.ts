import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleAuthor, ArticlesApi, ReleaseObj } from '../../interfaces';
import { ReleaseMonthPipe } from '../../pipes';
import { Router } from '@angular/router';
import { Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { NgClass } from '@angular/common';
import es from '@/i18n/es.json';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage } from '../../utils';
import { ArticleCategory } from '../../types';
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
  releases = signal<ReleaseObj[]>([]);
  releaseSelected = signal<Release>(
    (this.localStorageService.getItem('release') as Release) ?? 'current',
  );
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  layoutPage = signal<string>(publicLayoutPage);

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
          this.releases.set(
            data?.releases
              .map((item) => ({
                id: item.id,
                index: item.index,
                month: item.month,
                year: item.year,
                release: item.release,
                articles: this.getArticlesByRelease(item.release),
                name: item.name,
              }))
              .sort((a, b) => b.index - a.index),
          );
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

  getArticlesByRelease(release: Release): ArticleAuthor[] {
    let articlesRelease: ArticleAuthor[] = [];

    this.articlesApi()?.articles?.map((item) => {
      if (item.release === release) {
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

  navigateToReleasePage(release: Release): void {
    this.localStorageService.setItem('release', release);
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }

  navigateToArticleDetail(release: Release, category: ArticleCategory, slug: string) {
    this.localStorageService.setItem('release', release);
    this.router.navigate([`/articles/${release}/${category}/${slug}`]);
  }
}
