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
import { JsonPipe } from '@angular/common';
import { getColorCategory, publicLayoutPage } from '../../utils';
import { AnyCategory } from '../../types';
import { ArticleDetail } from '../../interfaces';

@Component({
  selector: 'out-article-detail-page',
  imports: [SafeHtmlPipe, TitlePage, JsonPipe],
  templateUrl: './article-detail-page.html',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailPage implements OnInit {
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
  color = computed<string>(() => {
    return getColorCategory(this.articleSelected()?.category);
  });

  ngOnInit(): void {
    this.getRouteParams();
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
    const { category, release, slug } = this.articleDetail();
    this.homeService
      .getArticleBySlug(release as Release, slug, category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((article) => {
        this.articleSelected.set(article);
      });
  }

  navigateToReleasePage(release: Release | string): void {
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
