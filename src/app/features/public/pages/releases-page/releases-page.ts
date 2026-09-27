import { Component, computed, inject, signal } from '@angular/core';
import { ArticleAuthor, ReleaseLocalStorage, ReleasesApi } from '../../interfaces';
import { ReleaseMonthPipe } from '../../pipes';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import es from '@/i18n/es.json';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { publicLayoutPage, staleTime } from '../../utils';
import { ViewState, ArticleCategory, ReleaseCode } from '../../types';
import { HomeService } from '../../services';
import { Spinner } from '@/shared/components/spinner/spinner';
import { LocalStorageService, SetInitReleaseService } from '@/core/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'out-releases-page',
  imports: [NgClass, ReleaseMonthPipe, TitlePage, Spinner],
  templateUrl: './releases-page.html',
})
export class ReleasesPage {
  protected readonly i18n = es;
  private localStorageService = inject(LocalStorageService);
  private homeService = inject(HomeService);
  private setInitReleasesService = inject(SetInitReleaseService);
  private router = inject(Router);

  readonly releasesApi = this.setInitReleasesService.releases;
  readonly articlesApi = injectQuery(() => ({
    queryKey: ['allArticles'],
    queryFn: () => lastValueFrom(this.homeService.getAllArticles()),
    staleTime,
  }));
  releases = computed<ReleasesApi[]>(() => {
    return (
      this.releasesApi
        .data()
        ?.map((item) => ({
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
        .sort((a, b) => b.index - a.index) ?? []
    );
  });
  releaseCodeSelected = computed<ReleaseCode>(() => {
    if (this.localStorageService.getItem('release')) {
      const releaseLS: ReleaseLocalStorage = JSON.parse(
        this.localStorageService.getItem('release') ?? '',
      );
      return releaseLS.code;
    }
    return '';
  });

  layoutPage = signal<string>(publicLayoutPage);
  viewState = computed<ViewState>(() => {
    if (this.releasesApi.isLoading() || this.articlesApi.isLoading()) return 'loading';
    if (this.releasesApi.isError() || this.articlesApi.isError()) return 'error';
    if (this.releases().length > 0) return 'available';
    return 'empty';
  });

  getArticlesByRelease(code: ReleaseCode): ArticleAuthor[] {
    let articlesRelease: ArticleAuthor[] = [];

    this.articlesApi.data()?.articles?.map((item) => {
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
