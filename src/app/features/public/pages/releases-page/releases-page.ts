import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ReleasesService } from '../../services/releases.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleAuthor, ArticlesApi, ReleaseObj } from '../../interfaces';
import { ReleaseMonthPipe, ReleasePipe } from '../../pipes';
import { Router } from '@angular/router';
import { Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { NgClass } from '@angular/common';
import { HomeService } from '../../services/home.service';
import es from '@/i18n/es.json';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage } from '../../utils';

@Component({
  selector: 'out-releases-page',
  imports: [ReleasePipe, NgClass, ReleaseMonthPipe, TitlePage],
  templateUrl: './releases-page.html',
})
export class ReleasesPage implements OnInit {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  private releasesService = inject(ReleasesService);
  private homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  releases = signal<ReleaseObj[]>([]);
  releaseSelected = signal<Release>(
    (this.localStorageService.getItem('release') as Release) ?? Release.CURRENT,
  );
  articlesApi = signal<ArticlesApi>({} as ArticlesApi);
  layoutPage = signal<string>(publicLayoutPage);

  ngOnInit(): void {
    this.getArticlesData();
    this.getReleasesApi();
  }

  getReleasesApi(): void {
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.releases.set(
          data?.releases
            .map((item) => ({
              id: item.id,
              index: item.index,
              month: item.month,
              year: item.year,
              release: item.release,
              articles: this.getArticlesByRelease(item.release),
            }))
            .sort((a, b) => b.index - a.index),
        );
      });
  }

  getArticlesData(): void {
    this.homeService
      .getAllArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((articlesData) => {
        this.articlesApi.set(articlesData);
      });
  }

  getArticlesByRelease(release: Release): ArticleAuthor[] {
    let articlesRelease: ArticleAuthor[] = [];

    this.articlesApi()?.articles?.map((item) => {
      if (item.release === release) {
        articlesRelease.push({
          title: item.title,
          slug: item.slug,
          author: item.author,
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

  navigateToArticleDetail(release: Release, slug: string) {
    this.localStorageService.setItem('release', release);
    this.router.navigate([`/articles/${release}/${slug}`]);
  }
}
