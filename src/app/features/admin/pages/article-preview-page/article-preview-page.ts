import { TitlePage } from '@/shared/components/title-page/title-page';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import es from '@/i18n/es.json';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, HomeLayoutApi, ShareSocialItem } from '@/features/public/interfaces';
import { HomeService } from '@/features/public/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { textTeal600 } from '@/features/public/utils';
import { SafeHtmlPipe } from '@/features/public/pipes';

const SOCIAL_MEDIA: ShareSocialItem[] = [
  {
    social: 'Instagram',
    imgUrl: '/assets/images/logo-instagram.png',
    imgWidth: '34',
    imgAlt: 'Logo Instagram',
  },
  {
    social: 'Facebook',
    imgUrl: '/assets/images/logo-facebook.png',
    imgWidth: '22',
    imgAlt: 'Logo Facebook',
  },
  {
    social: 'WhatsApp',
    imgUrl: '/assets/images/logo-whatsapp.png',
    imgWidth: '30',
    imgAlt: 'Logo WhatsApp',
  },
  {
    social: 'X',
    imgUrl: '/assets/images/logo-X.png',
    imgWidth: '22',
    imgAlt: 'Logo X',
  },
  {
    social: 'LinkedIn',
    imgUrl: '/assets/images/logo-linkedin.png',
    imgWidth: '24',
    imgAlt: 'Logo LinkedIn',
  },
];

@Component({
  selector: 'out-article-preview-page',
  imports: [TitlePage, SafeHtmlPipe],
  templateUrl: './article-preview-page.html',
  styleUrl: '../../../public/pages/article-detail-page/article-detail-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticlePreviewPage implements OnInit {
  protected readonly i18n = es;
  private homeService = inject(HomeService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  articleSelected = signal<Article>({} as Article);
  activeParam = signal<string>('');
  homeLayoutApi = signal<HomeLayoutApi[]>([]);

  color = computed<string>(() => {
    const layoutFeatures =
      this.homeLayoutApi().find((item) => item.releaseCode === this.articleSelected().releaseCode)
        ?.features ?? [];
    return (
      layoutFeatures.find((elem) => elem.category === this.articleSelected().category)?.color
        ?.solid ?? textTeal600
    );
  });
  socialMediaItems = computed<ShareSocialItem[]>(() =>
    SOCIAL_MEDIA.map((item) => ({ ...item, article: this.articleSelected() })),
  );

  ngOnInit(): void {
    this.getRouteParams();
    this.getLayoutArticles();
    this.getArticleData();
  }

  getRouteParams(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.activeParam.set(params['id']);
    });
  }

  getArticleData(): void {
    this.homeService
      .getArticleById(this.activeParam())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (article) => {
          this.articleSelected.set(article);
        },
      });
  }

  getLayoutArticles(): void {
    this.homeService
      .getHomeLayout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (layoutData) => {
          this.homeLayoutApi.set(layoutData);
        },
      });
  }

  backToArticles(): void {
    this.router.navigate(['admin/articles-crud']);
  }
}
