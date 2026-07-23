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
import { Article } from '../../interfaces';
import { HomeService } from '../../services/home.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFontFamilyCategory } from '../../utils';

@Component({
  selector: 'out-article-detail-page',
  imports: [SafeHtmlPipe, ArticleSectionPipe],
  templateUrl: './article-detail-page.html',
  styles: `
    .content-article {
      p {
        margin-bottom: 30px;
      }
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

  fontFamilySelected = computed<string>(() => {
    return getFontFamilyCategory(this.articleSelected()?.category);
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

  navigateToReleasePage(release: Release | string): void {
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
