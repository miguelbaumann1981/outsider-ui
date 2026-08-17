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
import { ArticleSectionPipe, SafeHtmlPipe } from '../../pipes';
import { Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';
import {
  Article,
  Article2,
  CategoryEditorial,
  CategoryMicrostory,
  CategoryOpinion,
  CategoryOutsiders,
  CategoryPoetry,
  CategoryTales,
} from '../../interfaces';
import { HomeService } from '../../services/home.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitlePage } from '@/shared/components/title-page/title-page';
import { NgClass } from '@angular/common';
import { getColorCategory, publicLayoutPage } from '../../utils';
import { ArticleCategoryMapper } from '../../mappers';

type ArticleCategory =
  | CategoryEditorial
  | CategoryMicrostory
  | CategoryOpinion
  | CategoryOutsiders
  | CategoryPoetry
  | CategoryTales;

@Component({
  selector: 'out-article-detail-page',
  imports: [SafeHtmlPipe, ArticleSectionPipe, TitlePage, NgClass],
  templateUrl: './article-detail-page.html',
  styles: `
    .content-article {
      p {
        margin-bottom: 30px;
      }
    }
    .two-columns {
      column-count: 2;
      column-gap: 2rem;
      column-fill: balance;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailPage implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private homeService = inject(HomeService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  router = inject(Router);

  releaseSelected = signal<Release>(Release.CURRENT);
  slugSelected = signal<string>('');
  articleSelected = signal<Article>({} as Article);
  articleSelected2 = signal<ArticleCategory>({} as ArticleCategory);
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
      this.releaseSelected.set(params['release']);
      this.slugSelected.set(params['slug']);
    });
  }

  getArticleData(): void {
    this.homeService
      .getArticleBySlug(this.releaseSelected(), this.slugSelected())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((article) => {
        this.articleSelected.set(article);
      });
  }

  getArticleData2(): void {
    this.homeService
      .getArticleBySlug2(this.releaseSelected(), this.slugSelected())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((article: Article2) => {
        const mapper = ArticleCategoryMapper[article.category];
        if (!mapper) {
          this.articleSelected2.set({} as any);
          return;
        }
        this.articleSelected2.set(mapper(article));
      });
  }

  navigateToReleasePage(release: Release | string): void {
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
