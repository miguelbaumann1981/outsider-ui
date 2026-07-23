import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ReleasesService } from '../../services/releases.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleAuthor, ArticlesApi, ReleaseObj } from '../../interfaces';
import { ReleasePipe } from '../../pipes';
import { Router } from '@angular/router';
import { Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { NgClass } from '@angular/common';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'out-releases-page',
  imports: [ReleasePipe, NgClass],
  templateUrl: './releases-page.html',
})
export class ReleasesPage implements OnInit {
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
  articlesTitleAuthor = computed<ArticleAuthor[]>(() => {
    return this.articlesApi()?.articles?.map((item) => ({
      title: item.title,
      author: item.author,
    }));
  });

  ngOnInit(): void {
    this.getReleasesApi();
    this.getArticlesByRelease();
  }

  getReleasesApi(): void {
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.releases.set(data?.releases.sort((a, b) => b.index - a.index));
        // this.releases.update((item) => ({
        //   ...item,
        //   articles: [
        //     { title: 'aaa', author: 'bbb' },
        //     { title: 'aaa', author: 'bbb' },
        //     { title: 'aaa', author: 'bbb' },
        //   ],
        // }));
      });
  }

  getArticlesByRelease(): void {
    this.homeService
      .getArticles(this.releaseSelected())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((articlesData) => {
        this.articlesApi.set(articlesData);
      });
  }

  navigateToReleasePage(release: Release): void {
    this.localStorageService.setItem('release', release);
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
